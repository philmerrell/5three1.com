import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { ActivityService } from '../shared/services/activity.service';
import { ActivityComponent } from './components/activity/activity.component';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, AsyncPipe, ActivityComponent]
})
export class ProgressPage implements OnInit {
  activity$: Observable<any[]>;

  constructor(
    private activityService: ActivityService,

  ) { }

  ngOnInit() {
    this.getActivity();

  }

  private getActivity() {
    this.activity$ = this.activityService.getActivityObservable();
  }

}
