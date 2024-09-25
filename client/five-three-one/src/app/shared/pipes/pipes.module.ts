import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TimeElapsedPipe } from './time-elapsed.pipe';
import { TimeAheadPipe } from './time-ahead.pipe';
import { TimeAgoPipe } from './time-ago.pipe';



@NgModule({
  declarations: [ TimeElapsedPipe, TimeAheadPipe, TimeAgoPipe ],
  imports: [
    CommonModule
  ],
  providers: [ DatePipe ],
  exports: [ TimeElapsedPipe, TimeAheadPipe, TimeAgoPipe ]
})
export class PipesModule { }
