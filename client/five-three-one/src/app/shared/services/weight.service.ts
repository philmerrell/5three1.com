import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Lifts } from './cycle.service';
import { AlertController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';


export interface TrainingPercentage {
  percent: number;
};

export interface OneRepMax {
    squat: {
      lb: number,
      kg: number
    },
    bench: {
      lb: number,
      kg: number
    },
    deadlift: {
      lb: number,
      kg: number
    },
    shoulderPress: {
      lb: number,
      kg: number
    };
};

export interface BarbellAndWeights {
  barbellWeight: {
    lb: number,
    kg: number
  },
  weights: {
    lb: any[],
    kg: any[]
  }
}

export interface WeightIncrement {
  lb: number,
  kg: number
}

@Injectable({
  providedIn: 'root'
})
export class WeightService {
  trainingPercentageSubject: BehaviorSubject<number> = new BehaviorSubject(0.9);
  weightUnitSubject: BehaviorSubject<{unit: 'lb' | 'kg'}> = new BehaviorSubject<{unit: 'lb' | 'kg'}>({unit: 'lb'});
  barbellAndWeights: BarbellAndWeights;
  barbellAndWeightsSubject: BehaviorSubject<BarbellAndWeights> = new BehaviorSubject({} as BarbellAndWeights);
  oneRepMaxSubject: BehaviorSubject<OneRepMax> = new BehaviorSubject({squat: {lb: 0, kg: 0}, bench: {lb: 0, kg: 0}, deadlift: {lb: 0, kg: 0}, shoulderPress: {lb: 0, kg: 0} });
  weightIncrementSubject: BehaviorSubject<WeightIncrement> = new BehaviorSubject({ lb: 5.0, kg: 0.5 });
  weightRoundingSubject: BehaviorSubject<string> = new BehaviorSubject('nearest');
  
  
  constructor(private alertController: AlertController) {}

  async calculateWeight(oneRepMax: { lb: number, kg: number }, percentage: number) {
    const increment = await this.getWeightIncrement();
    const trainingPercent = await this.getTrainingPercentage();
    const weightLb = (oneRepMax.lb * trainingPercent) * percentage;
    const weightKg = (oneRepMax.kg * trainingPercent) * percentage;
    const roundTo = await this.getWeightRounding();
      if (roundTo === 'lowest') {
        return {
          lb: Math.floor(weightLb / increment.lb) * increment.lb,
          kg: Math.floor(weightKg / increment.kg) * increment.kg
        }
      }
      if (roundTo === 'highest') {
        return {
          lb: Math.ceil(weightLb / increment.lb) * increment.lb,
          kg: Math.ceil(weightKg / increment.kg) * increment.kg
        }
      }
      // roundTo === 'nearest'
      return {
        lb: Math.round(weightLb / increment.lb) * increment.lb,
        kg: Math.round(weightKg / increment.kg) * increment.kg
      }
  }

  convertToKg(lbs: number) {
    return  Math.round(lbs / 2.205);
  }

  convertToLb(kg: number) {
    return  Math.round(kg * 2.205);
  }

  setTrainingPercentage(percent: number) {
    this.trainingPercentageSubject.next(percent)
    return Preferences.set({ key: 'trainingPercent', value: JSON.stringify(percent)});
  }

  async getTrainingPercentage(): Promise<number> {
    const result = await Preferences.get({ key: 'trainingPercent'});
    return result.value ? parseFloat(result.value) : 0.9 ;
  }

  getTrainingPercentageObservable(): Observable<number> {
    return from(Preferences.get({ key: 'trainingPercent'})).pipe(
      switchMap((result: any) => {
        const value = result.value ? parseFloat(result.value) : 0.9;
        this.trainingPercentageSubject.next(value);
        return this.trainingPercentageSubject.asObservable();
      })
    )
  }

  /**
   * One Rep Max Methods
   */
  getOneRepMaxObservable(): Observable<OneRepMax> {
    return from(this.getOneRepMax()).pipe(
      switchMap((result: any) => {
        // const value = result.value !== null ? result.value : { squat: 0, bench: 0, deadlift: 0, shoulderPress: 0 };
        this.oneRepMaxSubject.next(result);
        return this.oneRepMaxSubject.asObservable();
      })
    )
  }

  setOneRepMax(oneRepMax: OneRepMax) {
    this.oneRepMaxSubject.next(oneRepMax);
    console.log(oneRepMax);
    return Preferences.set({ key: 'oneRepMax', value: JSON.stringify(oneRepMax)})
  }

  async getOneRepMax() {
    const result = await Preferences.get({ key: 'oneRepMax'});
    return result.value ? JSON.parse(result.value) : { squat: {lb: 0, kg: 0}, bench: {lb: 0, kg: 0}, deadlift: {lb: 0, kg: 0}, shoulderPress: {lb: 0, kg: 0} };
  }

  async setOneRepMaxSquat(weight: number, weightUnit: 'lb' | 'kg') {
    const oneRepMax = await this.getOneRepMax();
    const squat = this.createWeightObject(weight, weightUnit);
    const update = {
      ...oneRepMax,
      squat
    };
    this.setOneRepMax(update);
  }

  async setOneRepMaxBench(weight: number, weightUnit: 'lb' | 'kg') {
    const oneRepMax = await this.getOneRepMax();
    const bench = this.createWeightObject(weight, weightUnit);
    const update = {
      ...oneRepMax,
      bench
    };
    this.setOneRepMax(update);
  }

  async setOneRepMaxDeadlift(weight: number, weightUnit: 'lb' | 'kg') {
    const oneRepMax = await this.getOneRepMax();
    const deadlift = this.createWeightObject(weight, weightUnit);
    const update = {
      ...oneRepMax,
      deadlift
    };
    this.setOneRepMax(update);
  }

  async setOneRepMaxShoulderPress(weight: number, weightUnit: 'lb' | 'kg') {
    const oneRepMax = await this.getOneRepMax();
    const shoulderPress = this.createWeightObject(weight, weightUnit);
    const update = {
      ...oneRepMax,
      shoulderPress
    };
    this.setOneRepMax(update);
  }

  private createWeightObject(weight: number, weightUnit: 'lb' | 'kg') {
    if (weightUnit === 'lb') { 
      return {
        lb: weight,
        kg: this.convertToKg(weight)
      }
    } else {
      return {
        lb: this.convertToLb(weight),
        kg: weight
      }
    }
  }

  async presentOneRepMaxAlertPrompt(lift: 'squat' | 'bench' | 'deadlift' | 'shoulderPress', weightUnit: 'lb' | 'kg', currentWeight?) {
    const alert = await this.alertController.create({
      header: `${Lifts[lift]}`,
      subHeader: `One Rep Max (${weightUnit})`,
      inputs: [
        {
          name: 'weight',
          type: 'number',
          cssClass: 'one-rep-max-input',
          attributes: {
            inputmode: 'decimal'
          },
          value: currentWeight[weightUnit],
          min: 0
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'OK',
          handler: (data) => {
            const weight = parseInt(data.weight);
            switch (lift) {
              case 'squat':
                this.setOneRepMaxSquat(weight, weightUnit);
                break;
              case 'bench':
                this.setOneRepMaxBench(weight, weightUnit);
                break;
              case 'deadlift':
                this.setOneRepMaxDeadlift(weight, weightUnit);
                break;
              case 'shoulderPress':
                this.setOneRepMaxShoulderPress(weight, weightUnit);
                break;
            }
          }
        }
      ]
    });

    await alert.present();
    const oneRepMaxInput: any = document.querySelector('ion-alert input');
	  oneRepMaxInput.focus();
  }



  /**
   * Weight Unit Methods
   * @param unit 
   */

  setWeightUnit(unit: 'lb' | 'kg') {
    this.weightUnitSubject.next({ unit });
    return Preferences.set({ key: 'weightUnit', value: JSON.stringify({unit})});
  }

  async getWeightUnit() {
    const result = await Preferences.get({ key: 'weightUnit'});
    return result.value ? JSON.parse(result.value) : { unit: 'lb' };
  }

  getWeightUnitObservable(): Observable<{ unit: 'lb' | 'kg'}> {
    return from(this.getWeightUnit()).pipe(
      switchMap((result: any) => {
        this.weightUnitSubject.next(result);
        return this.weightUnitSubject.asObservable();
      })
    );
  }

  /**
   * Weight Precision Methods
   */
  setWeightIncrement(increment: WeightIncrement) {
    this.weightIncrementSubject.next(increment);
    return Preferences.set({ key: 'weightIncrement', value: JSON.stringify(increment)})
  }

  async getWeightIncrement(): Promise<WeightIncrement> {
    const result = await Preferences.get({ key: 'weightIncrement'});
    return result.value ? JSON.parse(result.value) : { lb: 5.0, kg: 1 };
  }

  getWeightIncrementObservable(): Observable<WeightIncrement> {
    return from(this.getWeightIncrement()).pipe(
      switchMap((result: any) => {
        this.weightIncrementSubject.next(result);
        return this.weightIncrementSubject.asObservable();
      })
    )
  }

  setWeightRounding(roundTo: string) {
    this.weightRoundingSubject.next(roundTo);
    return Preferences.set({ key: 'weightRounding', value: roundTo })
  }

  async getWeightRounding() {
    const result = await Preferences.get({ key: 'weightRounding'});
    return result.value ? result.value : 'nearest';
  }

  getWeightRoundingObservable(): Observable<string> {
    return from(Preferences.get({ key: 'weightRounding'})).pipe(
      switchMap((result: any) => {
        const value = result.value ? result.value : 'nearest';
        this.weightRoundingSubject.next(value);
        return this.weightRoundingSubject.asObservable();
      })
    )
  }

  /**
   * Weight Unit and Plates
   */

   /**
   * One Rep Max Methods
   */
  getBarbellAndWeightsObservable(): Observable<BarbellAndWeights> {
    if (this.barbellAndWeights) {
      return of(this.barbellAndWeights).pipe(
        switchMap((result: BarbellAndWeights) => {
          this.barbellAndWeightsSubject.next(result);
          return this.barbellAndWeightsSubject.asObservable();
        })
      );
    } else {
      return from(this.getBarbellAndWeights()).pipe(
        switchMap((result: any) => {
          this.barbellAndWeightsSubject.next(result);
          return this.barbellAndWeightsSubject.asObservable();
        })
      )
    }
  }

  setBarbellAndWeights(barbellAndWeights: BarbellAndWeights) {
    this.barbellAndWeights = barbellAndWeights;
    this.barbellAndWeightsSubject.next(barbellAndWeights);
    return Preferences.set({ key: 'barbellAndWeights', value: JSON.stringify(barbellAndWeights)})
  }

  async getBarbellAndWeights(): Promise<BarbellAndWeights> {
    if (this.barbellAndWeights) {
      return this.barbellAndWeights;
    } else {
      const result = await Preferences.get({ key: 'barbellAndWeights'});
      return result.value ? JSON.parse(result.value) : this.getBarbellAndWeightsDefaults()
    }
  }

  getBarbellAndWeightsDefaults(): BarbellAndWeights {
    return {
      barbellWeight: {
        lb: 45,
        kg: 20
      },
      weights: {
        lb: [
          {
            weight: 100,
            quantity: 0,
            selected: false
          },
          {
            weight: 65,
            quantity: 0,
            selected: false
          },
          {
            weight: 55,
            quantity: 0,
            selected: false
          },
          {
            weight: 45,
            quantity: 6,
            selected: true
          },
          {
            weight: 35,
            quantity: 2,
            selected: true
          },
          {
            weight: 25,
            quantity: 2,
            selected: true
          },
          {
            weight: 15,
            quantity: 0,
            selected: false
          },
          {
            weight: 10,
            quantity: 2,
            selected: true
          },
          {
            weight: 5,
            quantity: 2,
            selected: true
          },
          {
            weight: 2.5,
            quanitity: 2,
            selected: true
          },
          {
            weight: 1.25,
            quantity: 0,
            selected: false
          }
        ],
        kg: [
          {
            weight: 50,
            quantity: 0,
            selected: true
          },
          {
            weight: 25,
            quantity: 2,
            selected: true
          },
          {
            weight: 20,
            quantity: 2,
            selected: true
          },
          {
            weight: 15,
            quantity: 2,
            selected: true
          },
          {
            weight: 10,
            quantity: 2,
            selected: true
          },
          {
            weight: 5,
            quantity: 2,
            selected: true
          },
          {
            weight: 2.5,
            quantity: 2,
            selected: true
          },
          {
            weight: 1.25,
            quantity: 0,
            selected: true
          },
          {
            weight: 0.5,
            quantity: 2,
            selected: true
          }
        ]
      }
    }
  }
  
}
