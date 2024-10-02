import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Lift } from '../../../shared/services/cycle.service';
import { WeightService } from '../../../shared/services/weight.service';
import { IonBackButton, IonButton, IonButtons, IonCheckbox, IonCol, IonFooter, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonRow, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-edit-lift-modal',
  templateUrl: './edit-lift-modal.component.html',
  styleUrls: ['./edit-lift-modal.component.scss'],
  standalone: true,
  imports: [
    IonHeader, IonTitle, IonButton, IonToolbar, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, ReactiveFormsModule, IonItem, IonLabel, IonInput, IonFooter, FormsModule, IonCheckbox
  ]
})
export class EditLiftModalComponent implements OnInit {
  @Input() lift: Lift;
  @Input() unit: 'lb' | 'kg';
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private weightService: WeightService) { }

  ngOnInit() {
    this.form = this.formBuilder.nonNullable.group({
      reps: ['', Validators.required],
      weight: [0],
      complete: [false, Validators.required]
    });
    if (this.lift) {
      this.form.controls['reps'].setValue(this.lift.reps);
      this.form.controls['weight'].setValue(this.lift.weight[this.unit]);
      this.form.controls['complete'].setValue(this.lift.complete);
    }
  }

  saveLift() {
    if (this.form.valid) {
      const weight = this.convertWeight(this.form.value.weight);
      this.lift.weight = weight;
      this.lift.complete = this.form.value.complete;
      this.lift.reps = this.form.value.reps;
      this.modalController.dismiss();
    }
  }

  convertWeight(weight: number) {
    if (this.unit === 'lb') {
      return {
        lb: weight,
        kg: this.weightService.convertToKg(weight)
      }
    } else {
      return  {
        lb: this.weightService.convertToLb(weight),
        kg: weight
      }
      
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  

}
