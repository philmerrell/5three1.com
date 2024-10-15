import { Component, Input, OnInit } from '@angular/core';
import { IonButton, IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonInput, IonItem, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-create-lifts-modal',
  templateUrl: './create-lifts-modal.component.html',
  styleUrls: ['./create-lifts-modal.component.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonCard, IonItem, IonInput, IonCardHeader, IonCardTitle, IonCardSubtitle
  ]
})
export class CreateLiftsModalComponent  implements OnInit {
  @Input() type: 'squat' | 'bench' | 'deadlift' | 'shoulder press';
  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  addLifts() {
    
  }

}
