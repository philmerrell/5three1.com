import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Workout } from './cycle.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  activitySubject: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor() { }

  async addActivity(workout: Workout) {
    let activity = await this.getActivity();
    const activityObj = {
      datetimeCompleted: workout.datetimeCompleted,
      workoutId: workout.id 
    };
    // only keep track of 32 activites for now...
    if (activity.length > 32) {
      activity.pop();
    }
    activity.unshift(activityObj);
    this.activitySubject.next(activity);
    return Preferences.set({ key: 'activity', value: JSON.stringify(activity)});
  }

  async getActivity(): Promise<any[]> {
    const result = await Preferences.get({ key: 'activity' });
    return result.value ? JSON.parse(result.value) : [];
  }

  getActivityObservable(): Observable<any[]> {
    return from(this.getActivity()).pipe(
      switchMap((result: any[]) => {
        const value = result;
        this.activitySubject.next(value);
        return this.activitySubject.asObservable();
      })
    )
  }
}
