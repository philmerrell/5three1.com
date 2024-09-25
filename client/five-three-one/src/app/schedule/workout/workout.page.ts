import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
// import { ScreenService } from '../shared/services/screen.service';
// import { InAppPurchaseService, PRODUCT_PLATE_CALCULATOR, PurchaseStatus } from '../shared/services/in-app-purchase.service';
// import { IAPProduct, InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { OneRepMax, WeightService } from '../../shared/services/weight.service';
import { Cycle, CycleService, Lift, Workout } from '../../shared/services/cycle.service';
import { AlertController, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonRouterOutlet, IonText, IonTitle, IonToolbar, ModalController, NavController, ToastController } from '@ionic/angular/standalone';
import { ScheduleService } from '../../shared/services/schedule.service';
import { WorkoutCompleteService } from '../../shared/services/workout-complete/workout-complete.service';
import { WorkoutService } from '../../shared/services/workout.service';
import { HapticService } from '../../shared/services/haptic.service';
import { OnboardingService } from '../../onboarding/onboarding.service';
import { RestTimerService } from '../../shared/services/rest-timer.service';
import { RestTimerModalComponent } from '../../shared/components/rest-timer-modal/rest-timer-modal.component';
import { EditLiftComponent } from '../../shared/components/edit-lift-modal/edit-lift/edit-lift.component';
import { ActivityService } from '../../shared/services/activity.service';
import { PersonalRecordService, PRAttempt } from '../../shared/services/personal-record.service';
import { TimeElapsedPipe } from '../../shared/pipes/time-elapsed.pipe';
import { addIcons } from 'ionicons';
import { bulb, checkmark } from 'ionicons/icons';
// import { InAppPurchaseModalService } from '../shared/in-app-purchase-modal/in-app-purchase-modal.service';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonBackButton,
    IonTitle,
    IonContent,
    IonItem,
    IonIcon,
    IonLabel,
    IonText,
    IonList,
    IonListHeader,
    TimeElapsedPipe,
    RouterLink
  ]

})
export class WorkoutPage implements OnInit, OnDestroy {
  assistanceTemplateOnboardingStatus: { onboarded: boolean } = { onboarded: true };
  id: string;
  oneRepMax: OneRepMax;
  oneRepMaxSub: Subscription;
  workout: Workout;
  cycles: Cycle[];
  cyclesSubscription: Subscription;
  latestCompletedLiftIdSub: Subscription;
  latestCompletedLiftId: string = '';
  // plateCalculatorProduct: IAPProduct;
  purchaseStatusSub: Subscription;
  purchaseStatus = { plateCalculator: { owned: true }, personalRecords: { owned: true }};
  timer;
  weightUnit: 'lb' | 'kg';
  weightUnitSubscription: Subscription;


  constructor(
    private alertController: AlertController,
    private activityService: ActivityService,
    private cycleService: CycleService,
    private hapticService: HapticService,
    // private inAppPurchaseService: InAppPurchaseService,
    // private inAppPurchaseModalService: InAppPurchaseModalService,
    private modalController: ModalController,
    private navController: NavController,
    private onboardingService: OnboardingService,
    private personalRecordService: PersonalRecordService,
    private route: ActivatedRoute,
    private routerOutlet: IonRouterOutlet,
    private restTimerService: RestTimerService,
    private scheduleService: ScheduleService,
    // private screenService: ScreenService,
    // private store: InAppPurchase2,
    private toastController: ToastController,
    private workoutCompleteService: WorkoutCompleteService,
    private workoutService: WorkoutService,
    private weightService: WeightService) {
      addIcons({checkmark, bulb})
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getOneRepMax();
      this.getWorkout();
    });

    this.restTimerService.getRestTimerObservable().subscribe(timer => {
      this.timer = timer;
      if (timer === 0) {
        this.restTimerService.setLatestCompletedLiftId('');
      }
    });

    this.latestCompletedLiftIdSub = this.restTimerService.getLatestCompletedLiftIdObservable()
      .subscribe(id => this.latestCompletedLiftId = id);

    this.weightUnitSubscription = this.weightService.getWeightUnitObservable()
      .subscribe(weight => this.weightUnit = weight.unit);

    // this.purchaseStatusSub = this.inAppPurchaseService.getPlateCalculatorPurchaseStatusObservable()
    //   .subscribe(status => {
    //     this.purchaseStatus.plateCalculator = status
    //     if (!status.owned) {
    //       this.store.ready(() => {
    //         const products = this.store.products;
    //         this.plateCalculatorProduct = products.find(product => product.id === PRODUCT_PLATE_CALCULATOR);
    //       });
    //     }
    //   });
    // this.screenService.enableKeepScreenOn();
    this.getOnboardingAssistanceTemplateStatus();
  }

  ngOnDestroy() {
    this.oneRepMaxSub.unsubscribe();
    this.cyclesSubscription.unsubscribe();
    this.weightUnitSubscription.unsubscribe();
    if (this.latestCompletedLiftIdSub) {
      this.latestCompletedLiftIdSub.unsubscribe();
    }
    if (this.purchaseStatusSub) {
      this.purchaseStatusSub.unsubscribe();
    }
  }

  completeLift(lift: Lift) {
    this.hapticService.notification('SUCCESS');
    lift.complete = true;
    this.calculateCompletedWorkoutLifts();
    if (lift.failure) {
      this.presentPRAlert(lift);
    }
    const workoutIsComplete = this.checkIfWorkoutIsComplete();
    if (workoutIsComplete) {
      this.completeWorkout();
    } else {
      this.restTimerService.startRestTimer();
      this.restTimerService.setLatestCompletedLiftId(lift.id);
    }

  }

  async presentPRAlert(lift: Lift) {
    const alert = await this.alertController.create({
      header: 'PR Attempt',
      subHeader: 'How many reps did you get?',
      inputs: [
        {
          name: 'reps',
          type: 'number',
          cssClass: 'one-rep-max-input',
          attributes: {
            inputmode: 'decimal',
            required: true
          },
          value: null,
          min: 0
        }
      ],
      buttons: [
        {
          text: 'OK',
          handler: async (data) => {
            const reps = parseInt(data.reps);
            if (reps > 0) {
              lift.reps = parseInt(data.reps);
              const attempt = await this.personalRecordService.addPRAttempt(lift);
              if (attempt.record) {
                setTimeout(() => {
                  this.showPRToast(attempt);
                }, 500)
              } else {
                return false;
              }
            } else {
              return false
            }
            return false
          }
        }
      ]
    });

    await alert.present();
    const PRInput: any = document.querySelector('ion-alert input');
	  PRInput.focus();
  }

  getOneRepMax() {
    this.oneRepMaxSub = this.weightService.getOneRepMaxObservable().subscribe(oneRepMax => this.oneRepMax = oneRepMax);
  }

  setOneRepMax(key: string) {

  }

  async getWorkout() {
    this.cyclesSubscription = this.scheduleService.getScheduleObservable().subscribe(cycles => {
      this.cycles = cycles;
      cycles.forEach((cycle, i) => {
        const found = cycle.schedule.find(workout => workout.id === this.id);
        if (found) {
          this.workout = found;
          this.workoutService.startWorkout(this.workout);
          if (!cycle.datetimeStarted) {
            cycle.datetimeStarted = new Date().toISOString();
          }
        }
      });
    })
  }

  async presentRestTimerModal() {
      const modal = await this.modalController.create({
        component: RestTimerModalComponent,
        cssClass: 'rest-timer-modal'
      });
      modal.present();
  }

  async presentCancelWorkoutAlert() {
    const alert = await this.alertController.create({
      header: `Stop Workout`,
      message: `Are you sure you want to cancel this workout?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        }, {
          text: 'Yes',
          handler: () => {
            this.cancelWorkout();
          }
        }
      ]
    });
    await alert.present();
  }

  presentOneRepMaxPromptAlert(liftKey, weightUnit: 'lb' | 'kg', currentWeight) {
    this.weightService.presentOneRepMaxAlertPrompt(liftKey, weightUnit, currentWeight);
  }

  cancelWorkout() {
    this.restTimerService.resetRestTimer();
    // this.screenService.disableKeepScreenOn();
    this.restTimerService.setLatestCompletedLiftId('');
    this.workoutService.cancelWorkout(this.workout);
    this.navController.navigateBack('/tabs/schedule');
  }

  async completeWorkout() {
    this.restTimerService.resetRestTimer();
    // this.screenService.disableKeepScreenOn();
    this.workoutService.completeWorkout(this.workout);
    this.cycleService.setCycleCompleteStatus(this.cycles);
    this.activityService.addActivity(this.workout);
    await this.cycleService.setCycles(this.cycles);
    this.scheduleService.recalculateSchedule();
    this.navController.navigateBack('/tabs/schedule');
    this.showWorkoutCompleteModal();
  }

  private checkIfWorkoutIsComplete() {
    let warmupLiftsComplete = 0;
    for (let lift of this.workout.warmup) {
      if (lift.complete) {
        warmupLiftsComplete = warmupLiftsComplete + 1;
      }
    }
    let liftsComplete = 0;
    for (let lift of this.workout.lifts) {
      if (lift.complete) {
        liftsComplete = liftsComplete + 1;
      }
    }
    let assistanceLiftsComplete = 0;
    for (let lift of this.workout.assistanceWork) {
      if (lift.complete) {
        assistanceLiftsComplete = assistanceLiftsComplete + 1;
      }
    }

    return (warmupLiftsComplete === this.workout.warmup.length) && (liftsComplete === this.workout.lifts.length) && (assistanceLiftsComplete === this.workout.assistanceWork.length);
  }

  private async showWorkoutCompleteModal() {
    this.workoutCompleteService.showWorkoutCompleteModal(this.workout, this.weightUnit, this.routerOutlet);
  }

  private async showPRToast(attempt: PRAttempt) {
    const message = `<ion-icon name="trophy" size="large"></ion-icon> New Personal Record: ${attempt.estimated1RM[this.weightUnit]}`;

    const toast = await this.toastController.create({
      message,
      duration: 5000,
      color: 'dark',
      buttons: ['OK']
    });
    toast.present();
  }

  private calculateCompletedWorkoutLifts() {
    let completedReps = 0;
    let completedLbWeight = 0;
    let completedKgWeight = 0;
    for (const lift of this.workout.warmup) {
      if (lift.complete) {
        completedReps += lift.reps;
        completedLbWeight += lift.weight.lb * lift.reps;
        completedKgWeight += lift.weight.kg * lift.reps;
      }
    }
   
    for (const lift of this.workout.lifts) {
      if (lift.complete) {
        completedReps += lift.reps;
        completedLbWeight += lift.weight.lb * lift.reps;
        completedKgWeight += lift.weight.kg * lift.reps;
      }
    }

    for (const lift of this.workout.assistanceWork) {
      if (lift.complete) {
        completedReps += lift.reps;
        completedLbWeight += lift.weight.lb * lift.reps;
        completedKgWeight += lift.weight.kg * lift.reps;
      }
    }

    this.workout.completedWeight = { lb: completedLbWeight, kg: completedKgWeight };
    this.workout.completedReps = completedReps;
    this.calculateCompletedCycleLifts();
  }

  calculateCompletedCycleLifts() {
    for (const cycle of this.cycles) {
      let completedCycleReps = 0;
      let completedCycleWeight = { lb: 0, kg: 0 };
      for (const workout of cycle.schedule) {
        if (workout.completedReps && workout.completedWeight) {
          completedCycleWeight = {
            lb: completedCycleWeight.lb += workout.completedWeight.lb,
            kg: completedCycleWeight.kg += workout.completedWeight.kg
          };
          completedCycleReps = completedCycleReps += workout.completedReps;
        }
      }
      cycle.completedCycleReps = completedCycleReps;
      cycle.completedCycleWeight = completedCycleWeight;
      this.cycleService.setCycles(this.cycles);
    }
    
  }

  async editLift(lift) {
    const modal = await this.modalController.create({
      component: EditLiftComponent,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        lift
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data && data.action === 'edit') {
      if (data.applyToAll) {
        // this.updateAllLiftsOfType(data);
      } else {
        // this.updateOneLift(data);
      }
    }
    
  }

  setOnboardingAssistanceTemplateStatus() {
    this.assistanceTemplateOnboardingStatus = { onboarded: true };
    this.onboardingService.setOnboardingAssistanceTemplateStatus(true);
  }

  async getOnboardingAssistanceTemplateStatus() {
    this.assistanceTemplateOnboardingStatus = await this.onboardingService.getOnboardingAssistanceTemplateStatus();
  }


  async presentProductModal() {
    // this.inAppPurchaseModalService.presentProductModal(this.routerOutlet, this.plateCalculatorProduct);
  }

}
