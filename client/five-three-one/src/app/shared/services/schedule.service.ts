import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AssistanceWorkService, AssistanceWorkTemplate } from './assistance-work.service';
import { Cycle, CycleService, Workout } from './cycle.service';
import { OneRepMax, WeightService } from './weight.service';
import { Preferences } from '@capacitor/preferences';
import { WeightPlatesService } from './weight-plates.service';


export interface TargetDay {
  name: string;
  value: number;
  target: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  targetDaysSubject: BehaviorSubject<TargetDay[]> = new BehaviorSubject([]);
  scheduleSubject: BehaviorSubject<Cycle[]> = new BehaviorSubject([]);
  schedule: Cycle[];
  subscription: Subscription;
  private workoutDate;
  private targetDay;

  constructor(
    private assistanceWorkService: AssistanceWorkService,
    private cycleService: CycleService,
    private weightPlatesService: WeightPlatesService,
    private weightService: WeightService) {
      this.initScheduleObservable();
    }

  getScheduleObservable() {
    return this.scheduleSubject.asObservable();
  }

  async initScheduleObservable() {
    const cycles = await this.cycleService.getCycles();
    this.subscription = combineLatest([this.getOneRepMaxObservable(), this.getTrainingPercentageObservable(), this.getWeightIncrementObservable(), this.getWeightRoundingObservable(), this.getTargetDaysObservable(), this.getCurrentAssistanceWorkObservable()])
      .subscribe(async ([oneRepMax, tp, wi, wr, targetDays, assistanceWork]) => {
        this.schedule = await this.calculateCycleSchedule(cycles, oneRepMax, targetDays, assistanceWork);
        this.cycleService.setCycles(this.schedule);
        this.scheduleSubject.next(this.schedule);
      });
  }

  recalculateSchedule() {
    this.subscription.unsubscribe();
    this.initScheduleObservable();
  }

  async calculateCycleSchedule(cycles: Cycle[], oneRepMax: OneRepMax, td: TargetDay[], assistanceWork: AssistanceWorkTemplate) {
    const targetDays = this.getTargetDaysMap(td);
    const lastDateCompleted = this.getLastDateCompleted(cycles);
    for (const cycle of cycles) {
      for (const workout of cycle.schedule) {

        if (!workout.datetimeCompleted) {
          workout.targetDate = await this.calculateScheduleDate(targetDays, lastDateCompleted);
        }
        for (let lift of workout.lifts) {
          if (lift.weight) {
            lift.weight = await this.weightService.calculateWeight(oneRepMax[workout.key], lift.percentage);
            lift.plates = await this.weightPlatesService.calculate(lift.weight);
          }
        }

        for (let warmup of workout.warmup) {
          if (warmup.weight) {
            warmup.weight = await this.weightService.calculateWeight(oneRepMax[workout.key], warmup.percentage);
            warmup.plates = await this.weightPlatesService.calculate(warmup.weight);
          }
        }
        
        if (!workout.datetimeStarted) {
          // Workout has not started, replace all assistance lifts
          workout.assistanceWork = assistanceWork.lifts[workout.key];
          for (let lift of workout.assistanceWork) {
              if (lift.barbell && lift.weight) {
                lift.plates = await this.weightPlatesService.calculate(lift.weight);
              }
            
          }
        } else {
          // workout has started, only change lifts that have not been completed.
          for (let index in assistanceWork.lifts[workout.key]) {
            if (!workout.assistanceWork[index].complete) {
              const lift = assistanceWork.lifts[workout.key][index];
              workout.assistanceWork[index] = lift;
              if (lift.barbell & lift.weight) {
                lift.plates = await this.weightPlatesService.calculate(lift.weight);
              }
            }
          }
        }

        workout.totalWorkoutReps = this.addAllWorkoutReps(workout);
        workout.totalWorkoutWeight = this.addAllWorkoutWeight(workout);

      }
      
    }

    // add cycles totals
    this.addAllCycleReps(cycles);
    this.addAllCycleWeight(cycles);
    this.targetDay = undefined;
    this.workoutDate = undefined;
    return cycles;
  }

  private addAllWorkoutReps(schedule: Workout) {
    let totalReps = 0;
    schedule.lifts.forEach(lift => {
      totalReps = totalReps += lift.reps;
    });
    schedule.warmup.forEach(lift => {
      totalReps = totalReps += lift.reps;
    });
    schedule.assistanceWork.forEach(lift => {
      totalReps = totalReps += lift.reps;
    });
    return totalReps;
  }

  private addAllWorkoutWeight(workout: Workout) {
    let totalLbWeight = 0;
    let totalKgWeight = 0;
    workout.lifts.forEach(lift => {
      let repsLbWeight = lift.weight.lb * lift.reps;
      totalLbWeight = totalLbWeight += repsLbWeight;

      let repsKgWeight = lift.weight.kg * lift.reps;
      totalKgWeight = totalKgWeight += repsKgWeight;
    });

    workout.warmup.forEach(lift => {
      let repsLbWeight = lift.weight.lb * lift.reps;
      totalLbWeight = totalLbWeight += repsLbWeight;

      let repsKgWeight = lift.weight.kg * lift.reps;
      totalKgWeight = totalKgWeight += repsKgWeight;
    });

    workout.assistanceWork.forEach(lift => {
      let repsLbWeight = lift.weight.lb * lift.reps;
      totalLbWeight = totalLbWeight += repsLbWeight;

      let repsKgWeight = lift.weight.kg * lift.reps;
      totalKgWeight = totalKgWeight += repsKgWeight;
    });
    return {
      lb: totalLbWeight,
      kg: totalKgWeight
    };
  }

  private addAllCycleWeight(cycles: Cycle[]) {
    cycles.forEach(cycle => {
      let totalLbWeight = 0;
      let totalKgWeight = 0;

      cycle.schedule.forEach((workout: Workout) => {
        totalLbWeight = totalLbWeight += workout.totalWorkoutWeight.lb;
        totalKgWeight = totalKgWeight += workout.totalWorkoutWeight.kg;
      });
      
      cycle.totalCycleWeight = {
        lb: totalLbWeight,
        kg: totalKgWeight
      };
    });
  }

  private addAllCycleReps(cycles: Cycle[]) {
    cycles.forEach(cycle => {
      let totalReps = 0;
      cycle.schedule.forEach(cycle => {
        totalReps = totalReps += cycle.totalWorkoutReps;
      });
      cycle.totalCycleReps = totalReps;
    });
  }

  async calculateScheduleDate(targetDays: number[], lastDateCompleted?: string) {
    // TODO: REFACTOR
    if (!this.workoutDate && !this.targetDay) {
      let targetDay;
      if (lastDateCompleted) {
        const lastDateCompletedDay = new Date(lastDateCompleted).getDay();
        let targetDayIndex = targetDays.findIndex(day => day === lastDateCompletedDay);
        const nextDayIndex = targetDayIndex >= 0 ? targetDayIndex + 1 : 0;
        targetDay = targetDays[nextDayIndex] ? targetDays[nextDayIndex] : targetDays[0];
        let difference = targetDay - lastDateCompletedDay;
        difference = difference <= 0 ? difference + 7 : difference;
        const date = new Date();
        date.setDate(date.getDate() + difference);
        this.workoutDate = new Date(date);
        this.targetDay = targetDay;
      } else {
        targetDay = new Date().getDay();
        const closestTargetDay = this.findClosestTargetDay(targetDays, targetDay);
        let difference = closestTargetDay - targetDay;
        difference = difference >= 0 ? difference : difference + 7;
        const date  = new Date();
        date.setDate(date.getDate() + difference);
        this.workoutDate = new Date(date);
        this.targetDay = closestTargetDay
      }
      try {
        const returnDate = new Date(this.workoutDate).toISOString();
        return returnDate;
      } catch(error) {
        return '';
      }
    } else {
      let targetDayIndex = targetDays.findIndex(day => day === this.targetDay);
      const nextDayIndex = targetDayIndex >= 0 ? targetDayIndex + 1 : 0;
      const targetDay = targetDays[nextDayIndex] ? targetDays[nextDayIndex] : targetDays[0];
      let difference = targetDay - this.workoutDate.getDay();
      difference = difference <= 0 ? difference + 7 : difference;
      const date = this.workoutDate;
      date.setDate(date.getDate() + difference);
      this.workoutDate = new Date(date);
      this.targetDay = targetDay;
      try {
        const returnDate = new Date(date).toISOString();
        return returnDate;
      } catch(error) {
        return '';
      }
    }
  }

  formatWorkoutDateString(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  async getSavedCycles(): Promise<any> {
    const result = await Preferences.get({ key: 'savedCycles'});
    return result.value;
  }

  setTargetDays(targetDays: TargetDay[]) {
    this.targetDaysSubject.next(targetDays);
    Preferences.set({ key: 'targetDays', value: JSON.stringify(targetDays) })
  }

  async getTargetDays(): Promise<TargetDay[]> {
    const result = await Preferences.get({ key: 'targetDays'});
    return result.value ? JSON.parse(result.value) : this.getDefaultTargetDays();
  }

  getTargetDaysObservable(): Observable<TargetDay[]> {
    return from(this.getTargetDays()).pipe(
      switchMap((result: any) => {
        this.targetDaysSubject.next(result);
        return this.targetDaysSubject.asObservable();
      })
    )
  }

  findClosestTargetDay(targetDays: number[], day: number) {
    if (targetDays.length) {
      return targetDays.reduce(function(prev, curr) {
        const result = (Math.abs(curr - day) < Math.abs(prev - day) ? curr : prev)
        if (result < day) {
          return targetDays[0];
        } else {
          return result;
        }
      });
    } else {
      return 0;
    }
  }

  getDefaultTargetDays(): TargetDay[] {
    return [
      { name: 'Sunday', value: 0, target: false },
      { name: 'Monday', value: 1, target: false },
      { name: 'Tuesday', value: 2, target: false },
      { name: 'Wednesday', value: 3, target: false },
      { name: 'Thursday', value: 4, target: false },
      { name: 'Friday', value: 5, target: false },
      { name: 'Saturday', value: 6, target: false }
    ]
  }

  getTargetDaysMap(days: TargetDay[]) {
    const targetDaysMap = days
      .filter(day => day.target)
      .map(day => day.value)
    return targetDaysMap;
  }

  getLastDateCompleted(cycles: Cycle[]) {
    let lastDateCompleted;
    cycles.forEach((cycle) => {
      cycle.schedule.forEach((workout) => {
        if (workout.datetimeCompleted) {
          lastDateCompleted = workout.datetimeCompleted;
        }
      })
    })
    return lastDateCompleted;
  }

  private getOneRepMaxObservable() {
    return this.weightService.getOneRepMaxObservable();
  }

  private getWeightRoundingObservable() {
    return this.weightService.getWeightRoundingObservable();
  }

  private getTrainingPercentageObservable() {
    return this.weightService.getTrainingPercentageObservable();
  }

  private getWeightIncrementObservable() {
    return this.weightService.getWeightIncrementObservable();
  }

  private getCurrentAssistanceWorkObservable() {
    return this.assistanceWorkService.getCurrentAssistanceWorkObservable();
  }


}
