import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { Lift } from '../../../services/cycle.service';
import { WeightService } from '../../../services/weight.service';
import { IonBackButton, IonButton, IonButtons, IonCheckbox, IonCol, IonFooter, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonRange, IonRow, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { PercentPipe } from '@angular/common';


@Component({
  selector: 'app-edit-lift',
  templateUrl: './edit-lift.component.html',
  styleUrls: ['./edit-lift.component.scss'],
  standalone: true,
  imports: [
    PercentPipe,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonButton,
    IonTitle,
    IonGrid,
    IonRow,
    IonCol,
    ReactiveFormsModule,
    IonItem,
    IonLabel,
    IonInput,
    IonRange,
    IonCheckbox,
    IonFooter
  ]
})
export class EditLiftComponent implements OnInit {
  @Input() lift: Lift;
  @Input() unit: 'lb' | 'kg';
  form: FormGroup;
  action: 'edit' | 'add';
  applyToAll: boolean = false;
  
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private weightService: WeightService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: [uuidv4(), Validators.required],
      name: ['', [Validators.required]],
      reps: ['', Validators.required],
      weight: [0],
      percentage: [''],
      failure: ['', Validators.required],
      barbell: ['', Validators.required],
      complete: [false, Validators.required]
    });
    if (this.lift) {
      // this.form.patchValue(this.lift);
      this.form.controls['id'].setValue(this.lift.id);
      this.form.controls['name'].setValue(this.lift.name);
      this.form.controls['reps'].setValue(this.lift.reps);
      this.form.controls['weight'].setValue(this.lift.weight[this.unit]);
      this.form.controls['percentage'].setValue(this.lift.percentage);
      this.form.controls['failure'].setValue(this.lift.failure);
      this.form.controls['barbell'].setValue(this.lift.barbell);
      this.form.controls['complete'].setValue(this.lift.complete);
    }
    this.action = this.lift ? 'edit' : 'add';
  }

  saveExercise() {
    if (this.form.valid) {
      const lift = this.convertWeight(this.form.value);
      this.modalController.dismiss({ action: this.action, lift: lift, applyToAll: this.applyToAll });
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  updatePercentage(event) {
    console.log(event.detail.value);
  }

  convertWeight(value) {
    if (this.unit === 'lb') {
      return {
        ...value,
        weight: {
          lb: value.weight,
          kg: this.weightService.convertToKg(value.weight)
        }
      }
    }

    if (this.unit === 'kg') {
      return {
        ...value,
        weight: {
          lb: this.weightService.convertToLb(value.weight),
          kg: value.weight
        }
      }
    }
  }

}
