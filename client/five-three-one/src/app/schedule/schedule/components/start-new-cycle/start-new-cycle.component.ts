import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OneRepMax, WeightService } from '../../../../shared/services/weight.service';
import { CycleService } from '../../../../shared/services/cycle.service';
import { ScheduleService } from '../../../../shared/services/schedule.service';
import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonInput, IonItem, IonLabel, IonList, IonTitle, IonToolbar, ModalController, ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-start-new-cycle',
  templateUrl: './start-new-cycle.component.html',
  styleUrls: ['./start-new-cycle.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    ReactiveFormsModule,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonFooter
  ]
})
export class StartNewCycleComponent implements OnInit {
  @Input() oneRepMax: OneRepMax;
  @Input() unit: 'lb' | 'kg';
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private weightService: WeightService,
    private toastController: ToastController,
    private cycleService: CycleService,
    private scheduleService: ScheduleService) { }

  ngOnInit() {
    this.form = this.fb.group({
      squat: [0],
      bench: [0],
      deadlift: [0],
      shoulderPress: [0]
    });
    this.setFormValues();
  }

  async setFormValues() {
    this.form.controls['squat'].setValue(this.oneRepMax.squat[this.unit])
    this.form.controls['bench'].setValue(this.oneRepMax.bench[this.unit])
    this.form.controls['deadlift'].setValue(this.oneRepMax.deadlift[this.unit])
    this.form.controls['shoulderPress'].setValue(this.oneRepMax.shoulderPress[this.unit])
  }

  addWeight(weight: number, key: 'squat' | 'bench' | 'deadlift' | 'shoulderPress') {
    const currentWeight = this.form.controls[key].value;
    const newWeight = currentWeight + weight;
    this.form.controls[key].setValue(newWeight);
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

  async setOneRepMax() {
    const value = this.form.value;
    const result = this.convertWeights(value);
    await this.weightService.setOneRepMax(result);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async startNewCycle() {
    await this.setOneRepMax();
    await this.cycleService.resetCycles();
    this.scheduleService.recalculateSchedule();
    this.showScheduleResetToast();
    this.modalController.dismiss('new');
  }

  private async showScheduleResetToast() {
    const toast = await this.toastController.create({
      color: 'dark',
      message: 'Your new cycle has been created.',
      duration: 3000,
      buttons: [
        'OK'
      ]
    });
    toast.present();
  }

}
