import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { InAppPurchaseModalService } from '../in-app-purchase-modal/in-app-purchase-modal.service';
import { WorkoutCompleteComponent } from './workout-complete/workout-complete.component';
import { Workout } from '../cycle.service';
import { IonRouterOutlet, ModalController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class WorkoutCompleteService {

  constructor(
    // private inAppPurchaseModalService: InAppPurchaseModalService,
    private modalController: ModalController,
    private router: Router
    ) { }

  async showWorkoutCompleteModal(workout: Workout, unit: 'lb' | 'kg', routerOutlet: IonRouterOutlet) {
    const modal = await this.modalController.create({
      component: WorkoutCompleteComponent,
      presentingElement: routerOutlet.nativeEl,
      componentProps: {
        workout: workout,
        unit: unit
      }
    });
    
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.action === 'edit') {
      this.router.navigateByUrl('/tabs/schedule/completed-workouts/'+ workout.id);
    }

    if (data && data.action === 'purchase') {
      console.log('purchase');
      // this.inAppPurchaseModalService.presentProductModal(routerOutlet, data.product);
    }
  }

}
