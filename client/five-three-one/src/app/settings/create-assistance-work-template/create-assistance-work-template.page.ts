import { Component, OnInit } from '@angular/core';
import { IonAccordion, IonAccordionGroup, IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonRouterOutlet, IonText, IonTextarea, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { v4 as uuidv4 } from 'uuid';
import { AssistanceWorkTemplate } from '../../shared/services/assistance-work.service';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { CreateLiftsModalComponent } from './create-lifts-modal/create-lifts-modal.component';

@Component({
  selector: 'app-create-assistance-work-template',
  templateUrl: './create-assistance-work-template.page.html',
  styleUrls: ['./create-assistance-work-template.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonCard, IonItem, IonInput, IonTextarea,
    IonAccordion, IonAccordionGroup, IonLabel, IonIcon, IonText, IonBackButton, IonBadge
  ]
})
export class CreateAssistanceWorkTemplatePage  implements OnInit {
  assistanceTemplate: AssistanceWorkTemplate = {
    name: '',
    id:  uuidv4(),
    description: '',
    lifts: {
      squat: [],
      bench: [],
      deadlift: [],
      shoulderPress: []
    }
  }
  constructor(private modalController: ModalController, private outlet: IonRouterOutlet) {
    addIcons({add})
  }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  async presentCreateLiftsModal(type: string) {
    const modal = await this.modalController.create({
      component: CreateLiftsModalComponent,
      presentingElement: this.outlet.nativeEl,
      componentProps: {
        type: type
      }
    });
    modal.present();

    const {data} = await modal.onDidDismiss();
    console.log(data);
  }

}
