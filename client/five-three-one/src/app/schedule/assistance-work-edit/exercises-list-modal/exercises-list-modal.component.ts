import { Component, OnInit } from '@angular/core';
import { Lift } from '../../../shared/services/cycle.service';
import { IonButtons, IonContent, IonHeader, IonItem, IonList, IonSearchbar, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { ExercisesService } from '../../../shared/services/exercises.service';

@Component({
  selector: 'app-exercises-list-modal',
  templateUrl: './exercises-list-modal.component.html',
  styleUrls: ['./exercises-list-modal.component.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonSearchbar, IonContent, IonList, IonItem
  ]
})
export class ExercisesListModalComponent implements OnInit {
  // @Input() nav: IonNav;
  exercises: Lift[];

  constructor(private modalController: ModalController, private exercisesService: ExercisesService) { }

  ngOnInit() {
    this.exercises = this.exercisesService.getExercises();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  addExercise(lift: Lift) {
    // this.nav.push(EditLiftComponent, { lift })
  }

}
