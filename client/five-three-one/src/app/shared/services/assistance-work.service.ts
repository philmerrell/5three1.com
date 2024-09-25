import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Lift } from './cycle.service';
import { v4 as uuidv4 } from 'uuid';
import { switchMap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';


export interface AssistanceWorkTemplate {
  name: string;
  description: string;
  id: string;
  lifts: {
    squat: Lift[],
    bench: Lift[],
    deadlift: Lift[],
    shoulderPress: Lift[]
  }
}

@Injectable({
  providedIn: 'root'
})
export class AssistanceWorkService {
  currentAssistanceWorkSubject: BehaviorSubject<AssistanceWorkTemplate> = new BehaviorSubject({} as AssistanceWorkTemplate);
  
  constructor() { }

  setCurrentAssistanceWorkTemplate(template: AssistanceWorkTemplate) {
    this.currentAssistanceWorkSubject.next(template)
    return Preferences.set({ key: 'currentAssistanceWork', value: JSON.stringify(template)});
  }

  async getCurrentAssistanceWorkTemplate(): Promise<AssistanceWorkTemplate> {
    const result = await Preferences.get({ key: 'currentAssistanceWork'});
    return result.value ? JSON.parse(result.value) : this.getBoringButBigTemplate();
  }

  getCurrentAssistanceWorkObservable(): Observable<AssistanceWorkTemplate> {
    return from(this.getCurrentAssistanceWorkTemplate()).pipe(
      switchMap((result: any) => {
        // const value = result.value !== null ? result.value : { squat: 0, bench: 0, deadlift: 0, shoulderPress: 0 };
        this.currentAssistanceWorkSubject.next(result);
        return this.currentAssistanceWorkSubject.asObservable();
      })
    )
  }

  getAllTemplates() {
    return [
      this.getBoringButBigTemplate(),
      this.getBoringButBigBarbellTemplate(),
      this.getTriumvirateTemplate()
    ]
  }

  getTriumvirateTemplate() {
    return {
      name: 'Triumvirate',
      description: '',
      id: 'triumvirate',
      lifts: {
        squat: [
          {
            id: uuidv4(),
            name: 'Leg Press',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Leg Press',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Leg Press',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Leg Press',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Leg Press',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Leg Curl',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Leg Curl',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Leg Curl',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Leg Curl',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Leg Curl',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          }

        ],
        bench: [
          {
            id: uuidv4(),
            name: 'Dumbbell Bench Press',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dumbbell Bench Press',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dumbbell Bench Press',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dumbbell Bench Press',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dumbbell Bench Press',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dumbbell Row',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dumbbell Row',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dumbbell Row',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dumbbell Row',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dumbbell Row',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          }
        ],
      deadlift: [
          {
            id: uuidv4(),
            name: 'Good Morning',
            reps: 12,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Good Morning',
            reps: 12,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Good Morning',
            reps: 12,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Good Morning',
            reps: 12,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Good Morning',
            reps: 12,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Hanging Leg Raise',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Hanging Leg Raise',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Hanging Leg Raise',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Hanging Leg Raise',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Hanging Leg Raise',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          }
        ],
      shoulderPress: [
          {
            id: uuidv4(),
            name: 'Dips',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dips',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dips',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dips',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dips',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Chin-ups',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Chin-ups',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Chin-ups',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Chin-ups',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Chin-ups',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: false,
            weight: {
              lb: 0,
              kg: 0
            }
          }
        ]
      }
          
    }
  }

  getBoringButBigTemplate() {
    return {
      name: 'Boring But Big',
      description: '',
      id: 'boring-but-big',
      lifts: {
        squat: [
          {
            id: uuidv4(),
            name: 'Squat',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Squat',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Squat',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Squat',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Squat',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Leg Curl',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Leg Curl',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Leg Curl',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Leg Curl',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Leg Curl',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          }

        ],
        bench: [
          {
            id: uuidv4(),
            name: 'Bench',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Bench',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Bench',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Bench',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Bench',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dumbbell Row',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dumbbell Row',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dumbbell Row',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dumbbell Row',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Dumbbell Row',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          }
        ],
      deadlift: [
          {
            id: uuidv4(),
            name: 'Deadlift',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Deadlift',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Deadlift',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Deadlift',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Deadlift',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Hanging Leg Raise',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Hanging Leg Raise',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Hanging Leg Raise',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Hanging Leg Raise',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Hanging Leg Raise',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          }
        ],
      shoulderPress: [
          {
            id: uuidv4(),
            name: 'Shoulder Press',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Shoulder Press',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Shoulder Press',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Shoulder Press',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Shoulder Press',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Chin-ups',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Chin-ups',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Chin-ups',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Chin-ups',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Chin-ups',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          }
        ]
      }
          
    }
  }

  getBoringButBigBarbellTemplate() {
    return {
      name: 'Boring But Big Barbell',
      description: 'A variation of Boring But Big.',
      id: 'boring-but-big-barbell',
      lifts: {
        squat: [
          {
            id: uuidv4(),
            name: 'Squat',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Squat',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Squat',
            reps: 10,
            percentage: null, 
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Squat',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Squat',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Straight Leg Deadlift',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Straight Leg Deadlift',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Straight Leg Deadlift',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Straight Leg Deadlift',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Straight Leg Deadlift',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          }
        ],
        bench: [
          {
            id: uuidv4(),
            name: 'Bench',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Bench',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Bench',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Bench',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Bench',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Barbell Lat Pullover',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Barbell Lat Pullover',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Barbell Lat Pullover',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Barbell Lat Pullover',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Barbell Lat Pullover',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          }
        ],
      deadlift: [
          {
            id: uuidv4(),
            name: 'Deadlift',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Deadlift',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Deadlift',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Deadlift',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Deadlift',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Sit-ups',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Sit-ups',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Sit-ups',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Sit-ups',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Sit-ups',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          }
        ],
      shoulderPress: [
          {
            id: uuidv4(),
            name: 'Shoulder Press',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Shoulder Press',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Shoulder Press',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Shoulder Press',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Shoulder Press',
            reps: 10,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Barbell Row',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Barbell Row',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Barbell Row',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Barbell Row',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          },
          {
            id: uuidv4(),
            name: 'Barbell Row',
            reps: 15,
            percentage: null,
            failure: false,
            complete: false,
            barbell: true,
            weight: {
              lb: 0,
              kg: 0
            }
          }
        ]
        
      }
          
    }
  }
}
