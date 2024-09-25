import { Component, OnInit } from '@angular/core';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonItem, IonLabel, IonList, IonSkeletonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-schedule-loading',
  templateUrl: './schedule-loading.component.html',
  styleUrls: ['./schedule-loading.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonButton,
    IonCardTitle,
    IonCardHeader,
    IonCardSubtitle,
    IonSkeletonText,
    IonLabel,
    IonItem,
    IonCardContent
  ]
})
export class ScheduleLoadingComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
