import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonRouterOutlet, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { Lift, Workout } from '../../shared/services/cycle.service';
import { ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../../shared/services/schedule.service';
import { WeightService } from '../../shared/services/weight.service';
import { EditLiftModalComponent } from './edit-lift-modal/edit-lift-modal.component';

@Component({
  selector: 'app-completed-workouts-detail',
  templateUrl: './completed-workouts-detail.page.html',
  styleUrls: ['./completed-workouts-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonListHeader, IonLabel, IonItem, IonButton, DatePipe, IonButtons, IonBackButton]
})
export class CompletedWorkoutsDetailPage implements OnInit {
  id: string;
  cyclesSubscription: Subscription;
  weightUnit: 'lb' | 'kg';
  weightUnitSubscription: Subscription;
  workout: Workout;

  constructor(
    private routerOutlet: IonRouterOutlet,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private weightService: WeightService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getWeightUnit();
      this.getWorkout();
    });
  }

  ngOnDestroy() {
    this.cyclesSubscription.unsubscribe();
    this.weightUnitSubscription.unsubscribe();
  }

  getWeightUnit() {
    this.weightUnitSubscription = this.weightService.getWeightUnitObservable()
      .subscribe(result => {
        this.weightUnit = result.unit;
      })
  }

  async getWorkout() {
    this.cyclesSubscription = this.scheduleService.getScheduleObservable().subscribe(cycles => {
      cycles.forEach((cycle, i) => {
        const found = cycle.schedule.find(workout => workout.id === this.id);
        if (found) {
          this.workout = found;
        }
      });
    })
  }

  async editLift(lift: Lift) {

    const modal = await this.modalController.create({
      component: EditLiftModalComponent,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        lift,
        unit: this.weightUnit
      }
    });

    await modal.present();

    // const alert = await this.alertController.create({
    //   header: `Edit Lift (${this.weightUnit})`,
    //   inputs: [
    //     {
    //       name: 'weight',
    //       type: 'number',
    //       placeholder: 'Weight',
    //       value: lift.weight[this.weightUnit],
    //       attributes: {
    //         min: 0,
    //         inputmode: 'decimal'
    //       }
    //     },
    //     {
    //       name: 'reps',
    //       type: 'number',
    //       placeholder: 'Reps',
    //       value: lift.reps,
    //       attributes: {
    //         min: 0,
    //         inputmode: 'decimal'
    //       }
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       cssClass: 'secondary',
    //       handler: () => {
    //         console.log('Confirm Cancel');
    //       }
    //     }, {
    //       text: 'Ok',
    //       handler: () => {
    //         console.log('Confirm Ok');
    //       }
    //     }
    //   ]
    // });

    // await alert.present();
  }

}
