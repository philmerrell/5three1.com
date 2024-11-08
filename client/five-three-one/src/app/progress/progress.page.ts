import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonRouterOutlet, IonRow, IonText, IonTitle, IonToolbar, Platform } from '@ionic/angular/standalone';
import { Observable, Subscription } from 'rxjs';
import { ActivityService } from '../shared/services/activity.service';
import { ActivityComponent } from './components/activity/activity.component';
import { Cycle } from '../shared/services/cycle.service';
import { PersonalRecordService, PRAttempt } from '../shared/services/personal-record.service';
import { ScheduleService } from '../shared/services/schedule.service';
import { WeightService } from '../shared/services/weight.service';
import { PrAttemptsComponent } from './components/pr-attempts/pr-attempts.component';
import { PersonalRecordsComponent } from './components/personal-records/personal-records.component';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
  standalone: true,
  imports: [PersonalRecordsComponent, IonContent, PrAttemptsComponent, IonHeader, IonTitle, IonToolbar, AsyncPipe, DatePipe, ActivityComponent, DecimalPipe, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonText]
})
export class ProgressPage implements OnInit {
  activity$: Observable<any[]>;
  schedule: Cycle[] = [];
  currentCycle: Cycle;
  completedCycleWorkouts: number = 0;
  completedCycleWorkoutsPercent: number = 0;
  completedCycleWeightPercent: number = 0;
  completedCycleRepPercent: number = 0;
  prAttempts$: Observable<PRAttempt[]>;
  personalRecords$: Observable<PRAttempt[]>;
  weightUnitSub: Subscription;
  weightUnit: 'lb' | 'kg';
  personalRecordsPurchaseStatusSub: Subscription;
  personalRecordsPurchaseStatus: { owned: boolean } = { owned: true };
  // personalRecordsProduct: IAPProduct | MockProduct;

  constructor(
    private activityService: ActivityService,
    // private inAppPurchaseService: InAppPurchaseService,
    // private inAppPurchaseModalService: InAppPurchaseModalService,
    private scheduleService: ScheduleService,
    private personalRecordService: PersonalRecordService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    // private store: InAppPurchase2,
    private weightService: WeightService) {}

  ngOnInit() {
    this.getActivity();
    this.getSchedule();
    this.getPRAttempts();
    this.getPersonalRecords();
    this.getWeightUnit();
    // this.personalRecordsPurchaseStatusSub = this.inAppPurchaseService.getPersonalRecordsPurchaseStatusObservable()
    //   .subscribe(status => { 
    //     this.personalRecordsPurchaseStatus = status
    //     if (!status.owned) {
    //       this.loadPersonalRecordsProduct()
    //     }
    //   });
  }

  ngOnDestroy() {
    this.weightUnitSub.unsubscribe();
    this.personalRecordsPurchaseStatusSub.unsubscribe();
  }

  getActivity() {
    this.activity$ = this.activityService.getActivityObservable();
  }

  getSchedule() {
    this.scheduleService.getScheduleObservable()
      .subscribe(schedule => {
        this.schedule = schedule;

        this.findCurrentCycle(schedule);
      })
  }

  getPRAttempts() {
    this.prAttempts$ = this.personalRecordService.getPRAttemptsObservable();
  }

  getPersonalRecords() {
    this.personalRecords$ = this.personalRecordService.getPersonalRecordsObservable();
  }

  getWeightUnit() {
    this.weightUnitSub = this.weightService.getWeightUnitObservable()
      .subscribe(weightUnit => this.weightUnit = weightUnit.unit);
  }

  findCurrentCycle(cycles: Cycle[]) {
    const currentCycle = cycles.find(cycle => {
      if (!cycle.datetimeCompleted) {
        return cycle || cycles[cycles.length];
      } else {
        return {}
      }
    });
    this.currentCycle = currentCycle;
    
    if (this.currentCycle) {
      this.getCompletedWorkoutCount(this.currentCycle);
    }
  }

  getCompletedWorkoutCount(cycle: Cycle) {
    let completedWorkouts = 0;
    for (const workout of cycle.schedule) {
      if (workout.datetimeCompleted) {
        completedWorkouts = completedWorkouts += 1;
      }
    }
    this.completedCycleWorkouts = completedWorkouts;
    this.completedCycleWeightPercent = Math.floor((cycle.completedCycleWeight.lb / cycle.totalCycleWeight.lb * 100)) || 0;
    this.completedCycleRepPercent = Math.floor((cycle.completedCycleReps / cycle.totalCycleReps * 100)) || 0;
    this.completedCycleWorkoutsPercent = Math.floor((completedWorkouts / cycle.schedule.length * 100)) || 0;
  }

  async presentProductModal() {
    // this.inAppPurchaseModalService.presentProductModal(this.routerOutlet, this.personalRecordsProduct);

  }

  private loadPersonalRecordsProduct() {
    const isNative = this.platform.is('capacitor');
    // if (isNative) {
    //   this.store.ready(() => {
    //     const products = this.store.products;
    //     this.personalRecordsProduct = products.find(product => product.id === PRODUCT_PERSONAL_RECORDS);
    //   });
    // } else {
    //   const products = this.inAppPurchaseService.getMockProducts();
    //   this.personalRecordsProduct = products.find(product => product.id === PRODUCT_PERSONAL_RECORDS);

    // }
  }

}
