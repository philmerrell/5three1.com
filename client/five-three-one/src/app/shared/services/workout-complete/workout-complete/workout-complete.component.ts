import { Component, Input, OnDestroy, OnInit } from '@angular/core';
// import { IAPProduct, InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import * as confetti from 'canvas-confetti';
import { Subscription } from 'rxjs';
import { Lift, Workout } from '../../cycle.service';
import { PersonalRecordService, PRAttempt } from '../../personal-record.service';
import { IonBadge, IonButton, IonButtons, IonCard, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonText, IonTitle, IonToolbar, ModalController, Platform } from '@ionic/angular/standalone';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
// import { HapticService } from '../../services/haptic.service';
// import { InAppPurchaseService, MockProduct, PRODUCT_PERSONAL_RECORDS } from '../../services/in-app-purchase.service';
// import { PRAttempt, PersonalRecordService } from '../../services/personal-record.service';
import { trophy } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-workout-complete',
  templateUrl: './workout-complete.component.html',
  styleUrls: ['./workout-complete.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    IonBadge,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonListHeader,
    IonCard,
    IonIcon,
  ]
})
export class WorkoutCompleteComponent implements OnInit, OnDestroy {
  @Input() workout: Workout;
  @Input() unit: 'lb' | 'kg';
  bestSet: Lift;
  record: PRAttempt;
  isRecord: boolean = false;
  elapsedTime: number;
  estimated1RM: { lb: number, kg: number };

  personalRecordsPurchaseStatusSub: Subscription;
  personalRecordsPurchaseStatus: { owned: boolean } = { owned: true };
  // personalRecordsProduct: IAPProduct | MockProduct;

  constructor(
    private modalController: ModalController,
    // private hapticService: HapticService,
    // private inAppPurchaseService: InAppPurchaseService,
    private personalRecordService: PersonalRecordService,
    private platform: Platform,
    // private store: InAppPurchase2,
    ) {
      addIcons({trophy});
    }

  ngOnInit() {
    this.calculateElapsedTime();
    this.getPRAttempt(this.workout);
    this.getPersonalRecord(this.workout.lifts[0].name);
    setTimeout(()=> {
      this.celebrate();
      // this.hapticService.vibrate();
    }, 1000);
    // this.personalRecordsPurchaseStatusSub = this.inAppPurchaseService.getPersonalRecordsPurchaseStatusObservable()
    //   .subscribe(status => { 
    //     this.personalRecordsPurchaseStatus = status
    //     if (!status.owned) {
    //       this.loadPersonalRecordsProduct();
    //     }
    //   });
  }

  ngOnDestroy() {
    if (this.personalRecordsPurchaseStatusSub) {
      this.personalRecordsPurchaseStatusSub.unsubscribe();
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  editWorkout(workout: Workout) {
    this.modalController.dismiss({ action: 'edit' });
  }

  // presentProductModal(product: IAPProduct | MockProduct) {
  //   // this.modalController.dismiss({ action: 'purchase', product });
  // }

  async getPersonalRecord(liftName) {
    const records = await this.personalRecordService.getPersonalRecords();
    this.record = records.find(currentRecord => currentRecord.name === liftName)
  }

  private calculateElapsedTime() {
    const started = new Date(this.workout.datetimeStarted);
    const ended = new Date(this.workout.datetimeCompleted);    
    const diff = started.getTime() - ended.getTime();
    let diffSeconds = Math.round(diff / 1000);
    diffSeconds = Math.abs(diffSeconds);
    this.elapsedTime = this.getElapsedTime(diffSeconds);
  }

  private getElapsedTime( difference: number ) {
    const seconds = Math.floor(difference % 60),
      displaySecs = (seconds < 10) ? '0' + seconds : seconds,
      minutes     = Math.floor((difference / 60) % 60),
      displayMins = (minutes < 10) ? '0' + minutes : minutes,
      hours = Math.floor((difference / 60 / 60) % 60);

    let display;

    if (hours > 0) {
      display = `${hours}h ${displayMins}m ${displaySecs}s`;
    } else {
      display = `${minutes}m ${displaySecs}s`;
    }
    return display;
  }

  celebrate() {
    const canvas = document.querySelector('canvas');
    // const confetti = require('canvas-confetti');
    const myConfetti = confetti.create(canvas, { resize: true });
    var count = 200;
    var defaults = {
      
    };
    
    function fire(particleRatio, opts) {
      myConfetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      }));
    }
    
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
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

  private loadPersonalRecordsProduct() {
    // const isNative = this.platform.is('capacitor');
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
