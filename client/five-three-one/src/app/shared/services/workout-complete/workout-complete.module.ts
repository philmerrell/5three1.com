import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WorkoutCompleteComponent } from './workout-complete/workout-complete.component';
import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  declarations: [ WorkoutCompleteComponent ],
  exports: [ WorkoutCompleteComponent ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule
  ]
})
export class WorkoutCompleteModule { }
