import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonRouterOutlet, IonText, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settings } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { Cycle, Workout } from '../../shared/services/cycle.service';
import { Observable, Subscription } from 'rxjs';
import { OneRepMax, WeightService } from '../../shared/services/weight.service';
import { ScheduleService } from '../../shared/services/schedule.service';
import { WorkoutService } from '../../shared/services/workout.service';
import { StartNewCycleComponent } from './components/start-new-cycle/start-new-cycle.component';
import { ScheduleLoadingComponent } from './components/schedule-loading/schedule-loading.component';
import { TimeAheadPipe } from '../../shared/pipes/time-ahead.pipe';
import { TodaysCompletedWorkoutComponent } from './components/todays-completed-workout/todays-completed-workout.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
  standalone: true,
  imports: [
    IonCardTitle,
    IonButton,
    IonButtons,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    DatePipe,
    RouterLink,
    ScheduleLoadingComponent,
    IonCardContent,
    IonText,
    IonLabel,
    IonItem,
    IonCardSubtitle,
    IonCardHeader,
    IonCard,
    TimeAheadPipe,
    TodaysCompletedWorkoutComponent
  ]
})
export class SchedulePage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  nextWorkout: Workout;
  todaysCompletedWorkout: Workout;
  schedule$: Observable<any>;
  oneRepMaxSub: Subscription;
  weightUnitSub: Subscription;
  weightUnit: 'lb' | 'kg';
  workoutInProgressSub: Subscription;
  workoutInProgress: string;
  workoutTimerSub: Subscription;
  workoutTimer: number;
  oneRepMax: OneRepMax;
  schedule = [];
  scheduleRequestComplete = false;
  sub: Subscription;
  constructor(
    private routerOutlet: IonRouterOutlet,
    private modalController: ModalController,
    private scheduleService: ScheduleService,
    private weightService: WeightService,
    private workoutService: WorkoutService
  ) {
    addIcons({ settings });
  }

  ngOnInit() {
    this.getSchedule();
    this.getWorkoutInProgress();
    this.getOneRepMax();
    this.getWeightUnit();
  }

  ngOnDestroy() {
    this.oneRepMaxSub.unsubscribe();
    this.workoutInProgressSub.unsubscribe();
    this.weightUnitSub.unsubscribe();
  }

  presentOneRepMaxPromptAlert(lift, weightUnit, currentWeight) {
    this.weightService.presentOneRepMaxAlertPrompt(lift, weightUnit, currentWeight);
  }

  async presentStartNewCycleModal() {
    const modal = await this.modalController.create({
      component: StartNewCycleComponent,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        oneRepMax: this.oneRepMax,
        unit: this.weightUnit
      }
    });
    
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data === 'new') {
      this.content.scrollToTop(1000);
    }
  }

  private getSchedule() {
    this.scheduleService.getScheduleObservable()
    .subscribe(schedule => {
      this.schedule = schedule
      this.getNextWorkout(this.schedule);
      this.getTodaysCompletedWorkout(this.schedule);
      this.scheduleRequestComplete = true;
    });
  }

  private getTodaysCompletedWorkout(cycles: Cycle[]) {
    let now = new Date().toISOString();
    now = now.slice(0,10);
    for (let cycle of cycles) {
      for (let workout of cycle.schedule) {
        if (workout.datetimeCompleted) {
          if (this.isToday(workout.datetimeCompleted)) {
            this.todaysCompletedWorkout = workout;
            // break;
          }
        }
      }
    }
  }

  private getWeightUnit() {
    this.weightUnitSub = this.weightService.getWeightUnitObservable()
      .subscribe(result => {
        this.weightUnit = result.unit;
      });
  }

  private isToday(workoutCompleted: string) {
    const completedLocalDateString = new Date(workoutCompleted).toLocaleString();
    const completed = new Date(completedLocalDateString);
    const today = new Date()
    return completed.getDate() === today.getDate() &&
      completed.getMonth() === today.getMonth() &&
      completed.getFullYear() === today.getFullYear();
  }

  private getNextWorkout(cycles: Cycle[]) {
    for (let cycle of cycles) {
      if (!cycle.datetimeCompleted) {
        const workout = cycle.schedule.find(workout => {
          return !workout.datetimeCompleted;
        });
        this.nextWorkout = workout ? workout : cycles[0].schedule[0];
        break;
      }
    }
  }

  private getWorkoutInProgress() {
    this.workoutInProgressSub = this.workoutService.getWorkoutInProgress()
      .subscribe(workoutInProgress => {
        this.workoutInProgress = workoutInProgress
      });
  }

  private getOneRepMax() {
    this.oneRepMaxSub = this.weightService.getOneRepMaxObservable()
      .subscribe(oneRepMax => {
        this.oneRepMax = oneRepMax
      });
  }

}
