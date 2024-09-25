import { Injectable } from '@angular/core';
import { WeightService } from './weight.service';

@Injectable({
  providedIn: 'root'
})
export class WeightPlatesService {
  defaultWeightSets = {
    POUNDS : [45, 35, 25, 10, 5, 2.5],
    METRIC : [1.25, 25, 20, 16, 10, 7.5, 5, 2.5],
  };

  constructor(private weightService: WeightService) { }

  /**
    * Calculates how many plates to put on a bar to have a certain weight
    * @param {Number} targetWeight - What you want the bar to weigh
    * @param {Object} [opts] - Options
    * @param {Array} [opts.set=defaultWeightSets.POUNDS] - A collection of plate
    * weights to use in the calculation.
    *
    * @param {Number} [opts.barbellWeight=45] - The weight of the barbell
    * plates are being put on.
    *
    * @param {Object} [opts.availablePlates={}] - Specifies what plates are available.
    * The plate weight should be the value, and the quantity available should be the value
    *
    * @param {Boolean} [opts.returnClosest=true] - Specifies whether the calculation
    * should fail, or simply return the nearest available weight
    * when no precise match is possible
    *
    * @param {Array} [opts.addedPlates=[]] - An array of weights that should be
    * added to the current set.
    * @return {{plates: Array}} - An array containing information about the calculation
    * that was done and an array of how many plates should be put on the bar
    */
  async calculate(targetWeight: { lb: number, kg: number }, opts = {}) {
    const barbellAndWeights = await this.weightService.getBarbellAndWeights();
    // const weightUnit = await this.weightService.getWeightUnit();
    // const unit = weightUnit.unit
    const setLb = barbellAndWeights.weights.lb.map(plate => {
      if (plate.selected) {
        return plate.weight
      }
    });
    const setKg = barbellAndWeights.weights.kg.map(plate => {
      if (plate.selected) {
        return plate.weight
      }
    });
    const options = Object.assign({
      set: {
        lb: setLb,
        kg: setKg
      },
      barbellWeight : {
        lb: barbellAndWeights.barbellWeight.lb,
        kg: barbellAndWeights.barbellWeight.kg
      },
      availablePlates : {},
      returnClosest : true,
      addedPlates : [],
    }, opts);

    let currentWeight = {
      lb: options.barbellWeight.lb,
      kg: options.barbellWeight.kg
    };

    options.set.lb = options.set.lb.concat(options.addedPlates);

    // Put in order by weight, descending
    options.set.lb.sort((a, b) => (a - b)).reverse();

    const result = {
      plates : {
        lb: [],
        kg: []
      },
      closestWeight: null
    };

    // This specifies that two symmetric plates are assumed for all plate additions.
    // This is assumed for now, but could change if an asymetric mode is added.
    const multiplier = 2;

    options.set.lb.forEach((plateWeight) => {
      let limitation = options.availablePlates[plateWeight];

      if (limitation % multiplier) {
        // Weight limits must be divisible by 2 for now.
        limitation -= 1;
      }

      // Null limitation == infinite
      if (currentWeight.lb < targetWeight.lb && (limitation == null || limitation >= multiplier)) {
        // The weight we're testing to see if it will fit
        const testWeight = plateWeight;

        // Check if we can add this weight to the bar
        if (testWeight <= targetWeight.lb - currentWeight.lb) {
          // How many of this plate can we add in total?
          let qty = Math.floor((targetWeight.lb - currentWeight.lb) / testWeight);

          if (qty % multiplier) {
            qty -= 1;
          }

          // Reduce if there are limitations
          if (limitation && qty > limitation) {
            qty = limitation;
          }

          if (qty) {
            // Only display plates for one side of the bar
            let i = qty / 2;
            while (i > 0) {
              result.plates.lb.push({
                plateWeight,
                qty: 1
              });
              i = i - 1;
            }
            // result.plates.push({
            //   plateWeight,
            //   qty,
            // });
          }

          // Add weight to the bar
          currentWeight.lb += testWeight * qty;
        }
      }
    });
    options.set.kg.forEach((plateWeight) => {
      let limitation = options.availablePlates[plateWeight];

      if (limitation % multiplier) {
        // Weight limits must be divisible by 2 for now.
        limitation -= 1;
      }

      // Null limitation == infinite
      if (currentWeight.kg < targetWeight.kg && (limitation == null || limitation >= multiplier)) {
        // The weight we're testing to see if it will fit
        const testWeight = plateWeight;

        // Check if we can add this weight to the bar
        if (testWeight <= targetWeight.kg - currentWeight.kg) {
          // How many of this plate can we add in total?
          let qty = Math.floor((targetWeight.kg - currentWeight.kg) / testWeight);

          if (qty % multiplier) {
            qty -= 1;
          }

          // Reduce if there are limitations
          if (limitation && qty > limitation) {
            qty = limitation;
          }

          if (qty) {
            // Only display plates for one side of the bar
            let i = qty / 2;
            while (i > 0) {
              result.plates.kg.push({
                plateWeight,
                qty: 1
              });
              i = i - 1;
            }
            // result.plates.push({
            //   plateWeight,
            //   qty,
            // });
          }

          // Add weight to the bar
          currentWeight.kg += testWeight * qty;
        }
      }
    });

    if (options.returnClosest === false && currentWeight.lb !== +targetWeight) {
      throw new Error(`Achieving ${targetWeight} is impossible with 
      current weight set and/or limitations. Closest possible weight is ${currentWeight}`);
    } else {
      result.closestWeight = currentWeight;
    }
    return result.plates;
  }

}
