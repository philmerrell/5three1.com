import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardHeader, IonCheckbox, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonTitle, IonToolbar, IonCardTitle, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { BarbellAndWeights, WeightService } from '../../shared/services/weight.service';

@Component({
  selector: 'app-plate-calculator',
  templateUrl: './plate-calculator.page.html',
  styleUrls: ['./plate-calculator.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, FormsModule, IonList, IonItem, IonInput, IonListHeader, IonLabel, IonCheckbox, IonCard, IonCardTitle, IonCardHeader, IonButtons, IonBackButton]
})
export class PlateCalculatorPage implements OnInit {
  barbellAndWeightSub: Subscription;
  barbellAndWeights: BarbellAndWeights;
  weightUnitSub: Subscription;
  weightUnit: {unit: 'lb' | 'kg'};

  constructor(private weightService: WeightService) { }

  ngOnInit() {
    this.barbellAndWeightSub = this.weightService.getBarbellAndWeightsObservable()
      .subscribe(barbellAndWeights => this.barbellAndWeights = barbellAndWeights);
    this.weightUnitSub = this.weightService.getWeightUnitObservable()
      .subscribe(weightUnit => this.weightUnit = weightUnit);
  }

  ngOnDestroy() {
    this.barbellAndWeightSub.unsubscribe();
    this.weightUnitSub.unsubscribe();
  }

  setWeightUnit(selection) {
    // if (selection.detail) {
    //   const unit = selection.detail.value;
    //   this.barbellAndWeights.unit = unit;
    //   this.weightService.setBarbellAndWeights(this.barbellAndWeights)
    // }
  }

  selectWeight(selection) {
    const plateIndex = this.barbellAndWeights.weights[this.weightUnit.unit].findIndex(plate => plate === selection.detail.value);
    const upddatedPlate = { weight: selection.detail.value.weight, selected: selection.detail.checked };
    this.barbellAndWeights.weights[this.weightUnit.unit].splice(plateIndex, 1, upddatedPlate);
    this.weightService.setBarbellAndWeights(this.barbellAndWeights);
  }

  setBarWeight(event) {
    this.weightService.setBarbellAndWeights(this.barbellAndWeights)
  }

}
