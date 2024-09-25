import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Workout } from './cycle.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  timer: BehaviorSubject<number> = new BehaviorSubject(0);
  workoutInProgress: BehaviorSubject<string> = new BehaviorSubject('');
  workoutTimerSubscription: Subscription;
  
  constructor() { }

  completeWorkout(workout: Workout) {
    workout.datetimeCompleted = new Date().toISOString();
    this.workoutInProgress.next('');
  }

  getWorkoutTimerObservable() {
    return this.timer.asObservable();
  }

  getWorkoutInProgress(): Observable<string> {
    return this.workoutInProgress.asObservable();
  }

  startWorkout(workout: Workout) {
    this.workoutInProgress.next(workout.id);
    if (!workout.datetimeStarted) {
      workout.datetimeStarted = new Date().toISOString();
    }
  }

  cancelWorkout(workout: Workout) {
    this.resetLiftsCompleted(workout);
    this.workoutInProgress.next('');
    delete workout.datetimeStarted;
  }

  resetLiftsCompleted(workout: Workout) {
    for (let lift of workout.assistanceWork) {
      lift.complete = false;
    }
    for (let lift of workout.warmup) {
      lift.complete = false;
    }
    for (let lift of workout.lifts) {
      lift.complete = false;
    }
  }

}
