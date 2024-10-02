import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonRadio, IonRadioGroup, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { WeightIncrement, WeightService } from '../../shared/services/weight.service';

@Component({
  selector: 'app-weight-precision',
  templateUrl: './weight-precision.page.html',
  styleUrls: ['./weight-precision.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, FormsModule, IonList, IonRadioGroup, IonListHeader, IonLabel, IonItem, IonRadio, AsyncPipe, IonButtons, IonBackButton

  ]
})
export class WeightPrecisionPage implements OnInit {
  weightUnit$: Observable<{unit: 'lb' | 'kg'}>;
  weightIncrement$: Observable<any>;
  weightRounding$: Observable<any>;

  constructor(private weightService: WeightService) { }

  ngOnInit() {
    this.weightUnit$ = this.weightService.getWeightUnitObservable();
    this.weightIncrement$ = this.weightService.getWeightIncrementObservable();
    this.weightRounding$ = this.weightService.getWeightRoundingObservable();
  }


  setWeightUnit(selection) {
    if (selection.detail) {
      const unit = selection.detail.value;
      this.weightService.setWeightUnit(unit);
    }
  }

  setWeightIncrement(selection, weightIncrement: WeightIncrement, unit: 'lb' | 'kg') {
    if (selection.detail) {
      const increment = selection.detail.value;
      console.log(increment, weightIncrement, unit);
      let newIncrement = {
        ...weightIncrement,
      };
      newIncrement[unit] = increment;
      this.weightService.setWeightIncrement(newIncrement);
    }
  }

  setWeightRounding(selection) {
    if (selection.detail) {
      const rounding = selection.detail.value;
      this.weightService.setWeightRounding(rounding);
    }
  }

}
