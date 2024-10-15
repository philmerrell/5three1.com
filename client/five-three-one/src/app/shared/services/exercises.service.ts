import { Injectable } from '@angular/core';
import { Lift } from './cycle.service';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {

  constructor() { }

  getExercises(): Lift[] {
    return [
      {
        name: 'Squat',
        reps: 0,
        percentage: null,
        failure: false,
        barbell: true,
        complete: false,
        weight: {
          lb: 0,
          kg: 0
        },
      },
      {
        name: 'Bench Press',
        reps: 0,
        percentage: null,
        failure: false,
        barbell: true,
        complete: false,
        weight: {
          lb: 0,
          kg: 0
        },
      },
      {
        name: 'Deadlift',
        reps: 0,
        percentage: null,
        failure: false,
        barbell: true,
        complete: false,
        weight: {
          lb: 0,
          kg: 0
        },
      },
      {
        name: 'Shoulder Press',
        reps: 0,
        percentage: null,
        failure: false,
        barbell: true,
        complete: false,
        weight: {
          lb: 0,
          kg: 0
        },
      },
      {
        name: 'Straight Leg Deadlift',
        reps: 0,
        percentage: null,
        failure: false,
        barbell: true,
        complete: false,
        weight: {
          lb: 0,
          kg: 0
        },
      },
      {
        name: 'Barbell Pullover',
        reps: 0,
        percentage: null,
        failure: false,
        barbell: true,
        complete: false,
        weight: {
          lb: 0,
          kg: 0
        },
      },
      {
        name: 'Barbell Row',
        reps: 0,
        percentage: null,
        failure: false,
        barbell: true,
        complete: false,
        weight: {
          lb: 0,
          kg: 0
        },
      }

    ]
  }
}
