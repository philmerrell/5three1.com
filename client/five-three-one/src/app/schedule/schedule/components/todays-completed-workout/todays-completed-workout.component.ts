import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
// import { IAPProduct, InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { Observable, Subscription } from 'rxjs';
// import { InAppPurchaseModalService } from '../../../shared/in-app-purchase-modal/in-app-purchase-modal.service';
// import { InAppPurchaseService, MockProduct, PRODUCT_PERSONAL_RECORDS } from '../../../shared/services/in-app-purchase.service';
import { Lift, Workout } from '../../../../shared/services/cycle.service';
import { PersonalRecordService } from '../../../../shared/services/personal-record.service';
import { WorkoutCompleteService } from '../../../../shared/services/workout-complete/workout-complete.service';
import { IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonItem, IonLabel, IonRouterOutlet, IonRow, IonText, Platform } from '@ionic/angular/standalone';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-todays-completed-workout',
  templateUrl: './todays-completed-workout.component.html',
  styleUrls: ['./todays-completed-workout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    IonBadge,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonText,
    IonCardContent,
    IonButton
  ]
})
export class TodaysCompletedWorkoutComponent implements OnInit, OnChanges, OnDestroy {
  @Input() workout: Workout;
  @Input() unit: 'lb' | 'kg';
  bestSet: Lift;
  isRecord: boolean = false;
  estimated1RM: {
    lb: number,
    kg: number
  };

  personalRecordsPurchaseStatusSub: Subscription;
  personalRecordsPurchaseStatus: { owned: boolean } = { owned: true };
  // personalRecordsProduct: IAPProduct | MockProduct;

  constructor(
    // private inAppPurchaseService: InAppPurchaseService,
    // private inAppPurchaseModalService: InAppPurchaseModalService,
    private personalRecordService: PersonalRecordService,
    private routerOutlet: IonRouterOutlet,
    // private store: InAppPurchase2,
    private platform: Platform,
    private workoutCompleteService: WorkoutCompleteService
    ) { }

  ngOnInit() {
    // this.getPRAttempt(this.workout);
    // this.personalRecordsPurchaseStatusSub = this.inAppPurchaseService.getPersonalRecordsPurchaseStatusObservable()
    //   .subscribe(status => { 
    //     this.personalRecordsPurchaseStatus = status
    //     if (!status.owned) {
    //       this.loadPersonalRecordsProduct();
    //     }
    //   });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['workout']) {
      this.getPRAttempt(changes['workout'].currentValue);
    }
  }

  ngOnDestroy() {
    this.personalRecordsPurchaseStatusSub.unsubscribe();
  }

  async getPRAttempt(workout: Workout) {
    const set = workout.lifts.find(lift => lift.failure === true);
    if (set && set.complete) {
      this.getEstimated1RM(set);
      this.bestSet = set;
      const records = await this.personalRecordService.getPersonalRecords();
      this.isRecord = !!records.find(record => record.id === set.id);
    }
  }

  getEstimated1RM(set) {
    this.estimated1RM = {
      lb: (set.weight.lb * set.reps * 0.0333 + set.weight.lb),
      kg: (set.weight.kg * set.reps * 0.0333 + set.weight.kg)
    };
  }

  presentPurchaseProductModal() {
    // this.inAppPurchaseModalService.presentProductModal(this.routerOutlet, this.personalRecordsProduct);
  }

  async showWorkoutCompleteModal() {
    this.workoutCompleteService.showWorkoutCompleteModal(this.workout, this.unit, this.routerOutlet);
  }

  private loadPersonalRecordsProduct() {
    const isNative = this.platform.is('capacitor');
    if (isNative) {
      // this.store.ready(() => {
      //   const products = this.store.products;
      //   this.personalRecordsProduct = products.find(product => product.id === PRODUCT_PERSONAL_RECORDS);
      // });
    } else {
      // const products = this.inAppPurchaseService.getMockProducts();
      // this.personalRecordsProduct = products.find(product => product.id === PRODUCT_PERSONAL_RECORDS);
    }
  }

}
