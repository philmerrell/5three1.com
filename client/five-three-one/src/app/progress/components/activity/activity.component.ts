import { DatePipe, NgClass } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IonCard, IonCol, IonGrid, IonRow, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-progress-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  standalone: true,
  imports: [
    IonCard, IonGrid, IonRow, IonCol, IonText, DatePipe, NgClass
  ]
})
export class ActivityComponent implements OnInit, OnChanges {
  @Input() activity: any[];
  today: Date;
  calendar: { dateObj: Date, didWorkout: boolean }[] = [];
  constructor() { }

  ngOnInit() {
    this.today = new Date();
    let index = 0;
    while (index < 32) {
      var d = new Date();
      d.setDate(d.getDate() - index);
      this.calendar.push({ dateObj: d, didWorkout: false });
      index = index + 1;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activity'].currentValue) {
      this.markCalendar();
    }
  }

  markCalendar() {
    for (let workout of this.activity) {
      const date = new Date(workout.datetimeCompleted);
      for (let day of this.calendar) {
        const d = day.dateObj.getDate();
        const m = day.dateObj.getMonth();
        const y = day.dateObj.getFullYear();

        if (d === date.getDate() && m === date.getMonth() && y === date.getFullYear()) {
          day.didWorkout = true;
        }
      }
    }
  }

}
