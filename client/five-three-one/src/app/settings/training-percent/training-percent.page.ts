import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, PercentPipe } from '@angular/common';
import { IonBackButton, IonButtons, IonCard, IonContent, IonHeader, IonItem, IonLabel, IonList, IonRadio, IonRadioGroup, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { WeightService } from '../../shared/services/weight.service';

@Component({
  selector: 'app-training-percent',
  templateUrl: './training-percent.page.html',
  styleUrls: ['./training-percent.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonButtons, IonBackButton, IonRadioGroup, IonRadio, IonItem, PercentPipe, AsyncPipe, IonCard, IonLabel]
})
export class TrainingPercentPage implements OnInit {
  trainingPercentage$: Observable<number>;
  constructor(private weightService: WeightService) { }

  ngOnInit() {
    this.trainingPercentage$ = this.weightService.getTrainingPercentageObservable();
  }

  ionViewDidEnter() {}

  setTrainingPercentage(selection) {
    if (selection.detail) {
      const percent = selection.detail.value;
      this.weightService.setTrainingPercentage(percent);
    }
  }


}
