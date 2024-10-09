import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { AssistanceWorkService } from './assistance-work.service';
import { Preferences } from '@capacitor/preferences';

export enum Lifts {
  squat = 'Squat',
  bench = 'Bench',
  deadlift = 'Deadlift',
  shoulderPress = 'Shoulder Press'
};

export enum Cycles {
  FiveFiveFive = '5/5/5+',
  ThreeThreeThree = '3/3/3+',
  FiveThreeOne = '5/3/1+',
  Deload = 'Deload'
}

export interface Cycle {
  datetimeStarted?: string;
  datetimeCompleted?: string;
  description: '5/5/5+' | '3/3/3+' | '5/3/1+' | 'Deload';
  complete: boolean;
  completedCycleReps: number;
  completedCycleWeight: {
    lb: number;
    kg: number;
  };
  totalCycleWeight: {
    lb: number;
    kg: number;
  };
  totalCycleReps: number;
  schedule: Workout[];  
}

export interface Workout {
  id: string;
  completedWeight?: {
    lb: number;
    kg: number;
  };
  completedReps?: number;
  cycle: string;
  description: string;
  key: string;
  targetDate?: string;
  lifts: Lift[],
  warmup: Lift[],
  assistanceWork: Lift[],
  totalWorkoutReps?: number;
  totalWorkoutWeight?: {
    lb: number;
    kg: number;
  };
  datetimeCompleted?: string;
  datetimeStarted?: string;
}

export interface Lift {
  id?: string;
  name: string;
  complete: boolean;
  reps: number;
  percentage: number;
  failure: boolean;
  weight?: {
    lb: number;
    kg: number;
  };
  plates?: {
    lb: any,
    kg: any 
  };
  barbell: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class CycleService {
  schedule: Cycle[] = [];
  cyclesSubject: BehaviorSubject<Cycle[]> = new BehaviorSubject([] as Cycle[]);
  warmupEnabledSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(private assistanceWorkService: AssistanceWorkService) {}

  async getSchedule(): Promise<Cycle[]> {
    if (this.schedule.length) {
      return new Promise((resolve) => {
        resolve(this.schedule);
      })
    } else {
      return new Promise(async (resolve) => {
        this.schedule = await this.createCycles();
        resolve(this.schedule);
      })
    }
  }

  getCyclesObservable(): Observable<Cycle[]> {
    return from(this.getCycles()).pipe(
      switchMap((result: any) => {
        this.cyclesSubject.next(result);
        return this.cyclesSubject.asObservable();
      })
    )
  }

  setCycles(cycles: Cycle[]) {
    this.cyclesSubject.next(cycles);
    return Preferences.set({ key: 'cycles', value: JSON.stringify(cycles)})
  }

  getWarmupEnabledObservable() {
    return from(this.getWarmupEnabled()).pipe(
      switchMap((result: boolean) => {
        this.warmupEnabledSubject.next(result);
        return this.warmupEnabledSubject.asObservable();
      })
    )
  }

  setWarmupEnabled(enabled: boolean) {
    this.warmupEnabledSubject.next(enabled);
    return Preferences.set({ key: 'warmupEnabled', value: JSON.stringify(enabled)})
  }

  async getWarmupEnabled(): Promise<boolean>{
    const result = await Preferences.get({ key: 'warmupEnabled'});
    return result.value ? JSON.parse(result.value) : true
  }

  async resetCycles() {
    const cycles = await this.createCycles();
    this.cyclesSubject.next(cycles);
    this.setCycles(cycles);
  }

  async getCycles(): Promise<Cycle[]>{
    const result = await Preferences.get({ key: 'cycles'});
    return result.value ? JSON.parse(result.value) : await this.createCycles();
  }

  async createCycles(): Promise<Cycle[]> {
    const schedule: Cycle[] = [];
    for (let cycle in Cycles) {
      let iteration = {
        description: Cycles[cycle as keyof typeof Cycles],
        schedule: [] as Workout[],
        completedCycleReps: 0,
        completedCycleWeight: { lb: 0, kg: 0 },
        complete: false,
        totalCycleWeight: { lb: 0, kg: 0 },
        totalCycleReps: 0
      };
      for (let lift in Lifts) {
        const workouts: Workout = await this.createWorkouts(lift, cycle)
        iteration.schedule.push(workouts)
      }
      schedule.push(iteration);
    }
    return schedule;
  }

  async getWorkout(id: string) {
    const cycles = await this.getCycles();
    let workout;
    cycles.forEach((cycle, i) => {
      const found = cycle.schedule.find(workout => workout.id === id);
      if (found) {
        workout = found;
      }
    });
    return workout;
  }

  setCycleCompleteStatus(cycles: Cycle[]) {
    for (let cycle of cycles) {
      let workoutsComplete = 0;
      for (const workout of cycle.schedule) {
        if (workout.datetimeCompleted) {
          workoutsComplete = workoutsComplete += 1;
        }
      }

      if (cycle.schedule.length === workoutsComplete) {
        if (!cycle.datetimeCompleted) {
          cycle.datetimeCompleted = new Date().toISOString();
        }
      }
    }
  }

  private async createWorkouts(lift: string, cycle: string): Promise<Workout> {
    switch (cycle) {
      case "FiveFiveFive": 
        return await this.create555Workout(lift);
      
      case "ThreeThreeThree": 
        return await this.create333Workout(lift);
      
      case "FiveThreeOne": 
        return await this.create531Workout(lift);
      
      case "Deload": 
        return await this.createDeloadWorkout(lift);
      default:
        return {} as Workout;
    }
  }

  private async create555Workout(lift: string, targetDate?: string): Promise<Workout> {
    const warmupEnabled = await this.getWarmupEnabled();
    const assistanceWork = await this.assistanceWorkService.getCurrentAssistanceWorkTemplate();
    return {
      id: uuidv4(),
      cycle: '5/5/5+',
      description: Lifts[lift as keyof typeof Lifts],
      key: lift,
      targetDate,
      lifts: [
        {
          id: uuidv4(),
          name: Lifts[lift as keyof typeof Lifts],
          reps: 5,
          percentage: 0.65,
          failure: false,
          complete: false,
          barbell: true,
          weight: {
            lb: 0,
            kg: 0
          }
        },
        {
          id: uuidv4(),
          name: Lifts[lift as keyof typeof Lifts],
          reps: 5,
          percentage: 0.75,
          failure: false,
          complete: false,
          barbell: true,
          weight: {
            lb: 0,
            kg: 0
          }
        },
        {
          id: uuidv4(),
          name: Lifts[lift as keyof typeof Lifts],
          reps: 5,
          percentage: 0.85,
          failure: true,
          complete: false,
          barbell: true,
          weight: {
            lb: 0,
            kg: 0
          }
        }
      ],
      warmup: warmupEnabled ? this.createWarmup(lift) : [],
      assistanceWork: []
    }
  }

  private async create333Workout(lift: string, targetDate?: string): Promise<Workout> {
    const assistanceWork = await this.assistanceWorkService.getCurrentAssistanceWorkTemplate();
    const warmupEnabled = await this.getWarmupEnabled();
    return {
      id: uuidv4(),
      cycle: '3/3/3+',
      description: Lifts[lift as keyof typeof Lifts],
      key: lift,
      targetDate,
      lifts: [
        {
          id: uuidv4(),
          name: Lifts[lift as keyof typeof Lifts],
          reps: 3,
          percentage: 0.70,
          failure: false,
          complete: false,
          barbell: true,
          weight: {
            lb: 0,
            kg: 0
          }
        },
        {
          id: uuidv4(),
          name: Lifts[lift as keyof typeof Lifts],
          reps: 3,
          percentage: 0.80,
          failure: false,
          complete: false,
          barbell: true,
          weight: {
            lb: 0,
            kg: 0
          }
        },
        {
          id: uuidv4(),
          name: Lifts[lift as keyof typeof Lifts],
          reps: 3,
          percentage: 0.90,
          failure: true,
          complete: false,
          barbell: true,
          weight: {
            lb: 0,
            kg: 0
          }
        }
      ],
      warmup: warmupEnabled ? this.createWarmup(lift) : [],
      assistanceWork: assistanceWork.lifts[lift as keyof typeof Lifts]

    }
  }

  private async create531Workout(lift: string, targetDate?: string): Promise<Workout> {
    const warmupEnabled = await this.getWarmupEnabled();
    const assistanceWork = await this.assistanceWorkService.getCurrentAssistanceWorkTemplate();
    return {
      id: uuidv4(),
      cycle: '5/3/1+',
      description: Lifts[lift as keyof typeof Lifts],
      key: lift,
      targetDate,
      lifts: [
        {
          id: uuidv4(),
          name: Lifts[lift as keyof typeof Lifts],
          reps: 5,
          percentage: 0.75,
          failure: false,
          complete: false,
          barbell: true,
          weight: {
            lb: 0,
            kg: 0
          }
        },
        {
          id: uuidv4(),
          name: Lifts[lift as keyof typeof Lifts],
          reps: 3,
          percentage: 0.85,
          failure: false,
          complete: false,
          barbell: true,
          weight: {
            lb: 0,
            kg: 0
          }
        },
        {
          id: uuidv4(),
          name: Lifts[lift as keyof typeof Lifts],
          reps: 1,
          percentage: 0.95,
          failure: true,
          complete: false,
          barbell: true,
          weight: {
            lb: 0,
            kg: 0
          }
        }
      ],
      warmup: warmupEnabled ? this.createWarmup(lift) : [],
      assistanceWork: assistanceWork.lifts[lift as keyof typeof Lifts]
    }
  }

  private async createDeloadWorkout(lift: string, targetDate?: string): Promise<Workout> {
    const warmupEnabled = await this.getWarmupEnabled();
    const assistanceWork = await this.assistanceWorkService.getCurrentAssistanceWorkTemplate();
    return {
      id: uuidv4(),
      cycle: 'Deload',
      description: Lifts[lift as keyof typeof Lifts],
      key: lift,
      targetDate,
      lifts: [
        {
          id: uuidv4(),
          name: Lifts[lift as keyof typeof Lifts],
          reps: 5,
          percentage: 0.40,
          failure: false,
          complete: false,
          barbell: true,
          weight: {
            lb: 0,
            kg: 0
          }
        },
        {
          id: uuidv4(),
          name: Lifts[lift as keyof typeof Lifts],
          reps: 5,
          percentage: 0.50,
          failure: false,
          complete: false,
          barbell: true,
          weight: {
            lb: 0,
            kg: 0
          }
        },
        {
          id: uuidv4(),
          name: Lifts[lift as keyof typeof Lifts],
          reps: 5,
          percentage: 0.60,
          failure: false,
          complete: false,
          barbell: true,
          weight: {
            lb: 0,
            kg: 0
          }
        }
      ],
      warmup: warmupEnabled ? this.createWarmup(lift) : [],
      assistanceWork: assistanceWork.lifts[lift as keyof typeof Lifts]
    }
  }

  createWarmup(lift: string) {
    return [
      {
        id: uuidv4(),
        name: Lifts[lift as keyof typeof Lifts],
        reps: 5,
        percentage: 0.40,
        failure: false,
        complete: false,
        barbell: true,
        weight: {
          lb: 0,
          kg: 0
        }
      },
      {
        id: uuidv4(),
        name: Lifts[lift as keyof typeof Lifts],
        reps: 5,
        percentage: 0.50,
        failure: false,
        complete: false,
        barbell: true,
        weight: {
          lb: 0,
          kg: 0
        }
      },
      {
        id: uuidv4(),
        name: Lifts[lift as keyof typeof Lifts],
        reps: 3,
        percentage: 0.60,
        failure: false,
        complete: false,
        barbell: true,
        weight: {
          lb: 0,
          kg: 0
        }
      }
    ]
  }
  

}
