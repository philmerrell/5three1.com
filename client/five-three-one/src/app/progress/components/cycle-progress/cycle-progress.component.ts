import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Color, Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-cycle-progress',
  templateUrl: './cycle-progress.component.html',
  styleUrls: ['./cycle-progress.component.scss'],
})
export class CycleProgressComponent {
  @Input() completedRepPercent: number;
  @Input() completedWeightPercent: number;
  @Input() completedWorkoutsPercent: number;
  @Input() totalWorkouts: number;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

}
