import { Component, OnInit } from '@angular/core';
import { AsyncPipe, PercentPipe } from '@angular/common';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonRouterOutlet, IonText, IonTitle, IonToolbar, ModalController, PopoverController, ToastController } from '@ionic/angular/standalone';
import { Lift, Lifts } from '../../shared/services/cycle.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AssistanceWorkService } from '../../shared/services/assistance-work.service';
import { WeightService } from '../../shared/services/weight.service';
import { EditLiftComponent } from '../../shared/components/edit-lift-modal/edit-lift/edit-lift.component';

@Component({
  selector: 'app-assistance-work-edit',
  templateUrl: './assistance-work-edit.page.html',
  styleUrls: ['./assistance-work-edit.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton, IonList, IonListHeader, IonLabel, IonText,
    IonButton, AsyncPipe, IonItem, PercentPipe
  ]
})
export class AssistanceWorkEditPage implements OnInit {
  LiftsEnum = Lifts
  lift: string;
  assistanceWork;
  lifts: Lift[];
  weightUnit$: Observable<{unit: 'lb' | 'kg'}>;

  constructor(
    private route: ActivatedRoute,
    private assistanceWorkService: AssistanceWorkService,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private toastController: ToastController,
    private popoverController: PopoverController,
    private weightService: WeightService) {
    this.route.params.subscribe((params: any) => {
      this.lift = params.lift;
      this.getAssistanceWork();
    })
  }

  ngOnInit() {
    this.weightUnit$ = this.weightService.getWeightUnitObservable();
  }

  async getAssistanceWork() {
    this.assistanceWork = await this.assistanceWorkService.getCurrentAssistanceWorkTemplate();
    this.lifts = this.assistanceWork.lifts[this.lift];
  }

  async openExerciseModal(unit: 'lb' | 'kg', lift?) {
    const modal = await this.modalController.create({
      component: EditLiftComponent,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        lift,
        unit
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data && data.action === 'add') {
      this.lifts.push(data.lift);
    }
    if (data && data.action === 'edit') {
      if (data.applyToAll) {
        this.updateAllLiftsOfType(data);
      } else {
        this.updateOneLift(data);
      }
    }
  }

  private updateAllLiftsOfType(data) {
    const similarLifts = this.lifts.filter(lift => lift.name === data.lift.name);
    for (let lift of similarLifts) {
      lift.barbell = data.lift.barbell;
      lift.percentage = data.lift.percentage;
      lift.reps = data.lift.reps;
      lift.weight = data.lift.weight;
      // lift.complete = lift.complete
    }
    this.saveAssistanceWork();
  }

  private updateOneLift(data) {
    const index = this.lifts.findIndex(lift => lift.id === data.lift.id);
    this.lifts.splice(index, 1, data.lift);
    this.saveAssistanceWork();
  }

  async presentPopover(ev: any, lift) {
    // const popover = await this.popoverController.create({
    //   component: OptionsPopoverComponent,
    //   event: ev,
    //   translucent: true,
    //   componentProps: {
    //     routerOutlet: this.routerOutlet,
    //     lift: lift
    //   }
    // });
    // await popover.present();

    // const { data } = await popover.onDidDismiss();
    // if (data) {
    //   switch (data) {
    //     case 'duplicate':
    //       return;
    //     case 'delete':
    //       return;
    //     case 'edit':
    //       this.openExerciseModal(lift);
    //       return;
    //   }
    // }
  }

  saveAssistanceWork() {
    this.assistanceWorkService.setCurrentAssistanceWorkTemplate(this.assistanceWork);
    this.showToast();
  }

  async showToast() {
    const toast = await this.toastController.create({
      message: 'Your assistance lift template is updated.',
      duration: 3000,
      color: 'dark',
      buttons: ['OK']
    });
    toast.present();
  }


}
