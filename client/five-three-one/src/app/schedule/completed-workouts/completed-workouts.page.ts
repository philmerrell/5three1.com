import { Component, OnInit } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { ScheduleService } from '../../shared/services/schedule.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-completed-workouts',
  templateUrl: './completed-workouts.page.html',
  styleUrls: ['./completed-workouts.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, DatePipe, RouterLink, IonButtons, IonBackButton]
})
export class CompletedWorkoutsPage implements OnInit {
  finishedWorkouts = [];
  scheduleRequestComplete = false;
  sub: Subscription;

  constructor(private scheduleService: ScheduleService) { }

  ngOnInit() {
    this.getSchedule();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private getSchedule() {
    this.sub = this.scheduleService.getScheduleObservable()
      .subscribe(schedule => {
        let allCycleWorkouts = [];
        for (let cycle of schedule) {
          allCycleWorkouts = [
            ...allCycleWorkouts,
            ...cycle.schedule
          ];
        }
        this.finishedWorkouts = allCycleWorkouts.filter(workout => workout.datetimeCompleted !== undefined).reverse();
        console.log(this.finishedWorkouts);
        this.scheduleRequestComplete = true;
      });
  }


}
