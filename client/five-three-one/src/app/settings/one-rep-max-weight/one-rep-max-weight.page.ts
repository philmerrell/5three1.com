import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { combineLatest, Subscription } from 'rxjs';
import { OneRepMax, WeightService } from '../../shared/services/weight.service';
import { OneRepMaxForm } from '../../onboarding/components/one-rep-max-settings/one-rep-max-settings.component';
import { bulb, bulbOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-one-rep-max-weight',
  templateUrl: './one-rep-max-weight.page.html',
  styleUrls: ['./one-rep-max-weight.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonListHeader, IonInput, IonList, IonIcon, IonText,
    IonLabel, IonCard, ReactiveFormsModule, IonItem, IonFooter, IonButton, IonButtons, IonBackButton,
  ]
})
export class OneRepMaxWeightPage implements OnInit {
  sub: Subscription;
  form: FormGroup<OneRepMaxForm> = this.fb.nonNullable.group({
    squat: [0, Validators.min(0)],
    bench: [0, Validators.min(0)],
    deadlift: [0, Validators.min(0)],
    shoulderPress: [0, Validators.min(0)]
  });
  unit: 'lb' | 'kg';
  
  constructor(
    private fb: FormBuilder,
    private weightService: WeightService) {
      addIcons({bulb})
    }

  async ngOnInit() {
    this.subscribeToUnitAndWeights();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  subscribeToUnitAndWeights() {
    this.sub = combineLatest([this.getOneRepMaxWeights(), this.getWeightUnitObservable()])
      .subscribe(
        ([oneRepMax, weightUnit]) => {
            this.unit = weightUnit.unit;
            this.setFormValues(oneRepMax)
          
        }
      )
  }

  getWeightUnitObservable() {
    return this.weightService.getWeightUnitObservable();
  }

  getOneRepMaxWeights() {
    return this.weightService.getOneRepMaxObservable();
    
  }

  setOneRepMax() {
    const value = this.form.value;
    const result = this.convertWeights(value);
    this.weightService.setOneRepMax(result);
  }

  async setFormValues(oneRepMaxWeights: OneRepMax) {
    if (oneRepMaxWeights && this.unit) {
      this.form.controls['squat'].setValue(oneRepMaxWeights.squat[this.unit])
      this.form.controls['bench'].setValue(oneRepMaxWeights.bench[this.unit])
      this.form.controls['deadlift'].setValue(oneRepMaxWeights.deadlift[this.unit])
      this.form.controls['shoulderPress'].setValue(oneRepMaxWeights.shoulderPress[this.unit])
    }
  }

  convertWeights(value) {
    console.log(this.unit);
    if (this.unit === 'lb') {
      return {
        squat: {
          lb: value.squat,
          kg: this.weightService.convertToKg(value.squat)
        },
        bench: {
          lb: value.bench,
          kg: this.weightService.convertToKg(value.bench)
        },
        deadlift: {
          lb: value.deadlift,
          kg: this.weightService.convertToKg(value.deadlift)
        },
        shoulderPress: {
          lb: value.shoulderPress,
          kg: this.weightService.convertToKg(value.shoulderPress)
        }
      }
    } else {
      return {
        squat: {
          lb: this.weightService.convertToLb(value.squat),
          kg: value.squat
        },
        bench: {
          lb: this.weightService.convertToLb(value.bench),
          kg: value.bench
        },
        deadlift: {
          lb: this.weightService.convertToLb(value.deadlift),
          kg: value.deadlift
        },
        shoulderPress: {
          lb: this.weightService.convertToLb(value.shoulderPress),
          kg: value.shoulderPress
        }
      }
    }
  }


}
