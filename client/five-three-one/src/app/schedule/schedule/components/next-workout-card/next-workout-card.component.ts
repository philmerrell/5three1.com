import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Workout } from '../../../shared/services/cycle.service';
import { OneRepMax } from '../../../shared/services/weight.service';
import { Label, MultiDataSet, Color } from 'ng2-charts';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';

@Component({
  selector: 'next-workout-card',
  templateUrl: './next-workout-card.component.html',
  styleUrls: ['./next-workout-card.component.scss'],
})
export class NextWorkoutCardComponent implements OnInit, OnChanges {
  @Input() workout: Workout;
  @Input() oneRepMax: OneRepMax;
  @Input() unit: 'lb' | 'kg';

  doughnutChartLabels: Label[] = ['Total Reps', 'Total Weight', 'Personal Record'];
  data: ChartDataSets = {};
  doughnutChartData: MultiDataSet = [];
  doughnutChartType: ChartType = 'doughnut';
  options: ChartOptions = {
    cutoutPercentage: 15,
    legend: {
      display: false
    }
  };
  colors: Color[] = [
    {
      backgroundColor: ['#A8DADC', '#77ABBD', '#eb445a', '#eee'],
    },
    {
      backgroundColor: ['#A8DADC', '#77ABBD', '#eb445a', '#eee'],
    },
    {
      backgroundColor: ['#A8DADC', '#77ABBD', '#eb445a', '#eee'],
    }
  ];

  constructor() { }

  ngOnInit() {
    this.doughnutChartData = [
      [90, 0, 0, 10],
      [0, 40, 0, 60],
      [0, 0, 70, 30],
    ]
  }

  ngOnChanges(changes) {
    console.log(changes);
  }

}
