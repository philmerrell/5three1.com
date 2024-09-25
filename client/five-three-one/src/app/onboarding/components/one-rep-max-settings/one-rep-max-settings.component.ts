import { Component, OnInit, Input } from '@angular/core';
import { ScheduleComponent } from '../schedule/schedule.component';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, Subscription } from 'rxjs';
import { BehaviorComponent } from '../behavior/behavior.component';
import { OneRepMax, WeightService } from '../../../shared/services/weight.service';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem, IonCheckbox, IonFooter, IonButton, IonRadioGroup, IonRadio, IonInput, IonNavLink, ModalController } from '@ionic/angular/standalone';

interface OneRepMaxForm {
  squat: FormControl<number>;
  bench: FormControl<number>;
  deadlift: FormControl<number>;
  shoulderPress: FormControl<number>;
}

@Component({
  selector: 'app-one-rep-max-settings',
  templateUrl: './one-rep-max-settings.component.html',
  styleUrls: ['./one-rep-max-settings.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonLabel,
    IonRadioGroup,
    IonRadio,
    IonInput,
    IonItem,
    IonCheckbox,
    IonFooter,
    IonButton,
    IonNavLink,
    ReactiveFormsModule
  ]
})
export class OneRepMaxSettingsComponent implements OnInit {
  sub: Subscription = new Subscription();
  form: FormGroup<OneRepMaxForm> = this.fb.nonNullable.group({
    squat: [0, Validators.min(0)],
    bench: [0, Validators.min(0)],
    deadlift: [0, Validators.min(0)],
    shoulderPress: [0, Validators.min(0)]
  });;
  unit: 'lb' | 'kg' = 'lb';
  behaviorComponent = BehaviorComponent;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private weightService: WeightService) { }

  ngOnInit() {
    this.subscribeToUnitAndWeights();
  }

  finish() {
    this.modalController.dismiss({ onboarded: true });
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
      this.form.controls.squat.setValue(oneRepMaxWeights.squat[this.unit])
      this.form.controls.bench.setValue(oneRepMaxWeights.bench[this.unit])
      this.form.controls.deadlift.setValue(oneRepMaxWeights.deadlift[this.unit])
      this.form.controls.shoulderPress.setValue(oneRepMaxWeights.shoulderPress[this.unit])
    }
  }

  convertWeights(value: any) {
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


  setScheduleSettings() {
    if (this.form.valid) {
      this.setOneRepMax();
      // this.nav.push(BehaviorComponent, { nav: this.nav });
    }
  }

  setWeightUnit(selection: any) {
    if (selection.detail) {
      const unit = selection.detail.value;
      this.weightService.setWeightUnit(unit);
    }
  }

  private subscribeToUnitAndWeights() {
    this.sub = combineLatest([this.getOneRepMaxWeights(), this.getWeightUnitObservable()])
      .subscribe(
        ([oneRepMax, weightUnit]) => {
            this.unit = weightUnit.unit;
            this.setFormValues(oneRepMax)
          
        }
      )
  }

}
