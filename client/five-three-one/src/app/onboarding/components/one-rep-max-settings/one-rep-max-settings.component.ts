import { Component, OnInit, Input } from '@angular/core';
import { IonNav } from '@ionic/angular';
import { ScheduleComponent } from '../schedule/schedule.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WeightService } from 'src/app/shared/services/weight.service';
import { combineLatest, Subscription } from 'rxjs';
import { BehaviorComponent } from '../behavior/behavior.component';

@Component({
  selector: 'app-one-rep-max-settings',
  templateUrl: './one-rep-max-settings.component.html',
  styleUrls: ['./one-rep-max-settings.component.scss'],
})
export class OneRepMaxSettingsComponent implements OnInit {
  @Input() nav: IonNav;
  sub: Subscription;
  form: FormGroup;
  unit: 'lb' | 'kg';

  constructor(
    private fb: FormBuilder,
    private weightService: WeightService) { }

  ngOnInit() {
    this.form = this.fb.group({
      squat: [0, Validators.min(0)],
      bench: [0, Validators.min(0)],
      deadlift: [0, Validators.min(0)],
      shoulderPress: [0, Validators.min(0)]
    });
    this.subscribeToUnitAndWeights();
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

  async setFormValues(oneRepMaxWeights) {
    if (oneRepMaxWeights && this.unit) {
      this.form.controls.squat.setValue(oneRepMaxWeights.squat[this.unit])
      this.form.controls.bench.setValue(oneRepMaxWeights.bench[this.unit])
      this.form.controls.deadlift.setValue(oneRepMaxWeights.deadlift[this.unit])
      this.form.controls.shoulderPress.setValue(oneRepMaxWeights.shoulderPress[this.unit])
    }
  }

  convertWeights(value) {
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
    } 
    
    if (this.unit === 'kg') {
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
      this.nav.push(BehaviorComponent, { nav: this.nav });
    }
  }

  setWeightUnit(selection) {
    if (selection.detail) {
      const unit = selection.detail.value;
      this.weightService.setWeightUnit(unit);
    }
  }

}
