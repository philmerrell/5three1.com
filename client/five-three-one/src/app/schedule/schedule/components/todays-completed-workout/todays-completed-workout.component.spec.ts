import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TodaysCompletedWorkoutComponent } from './todays-completed-workout.component';

describe('TodaysCompletedWorkoutComponent', () => {
  let component: TodaysCompletedWorkoutComponent;
  let fixture: ComponentFixture<TodaysCompletedWorkoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodaysCompletedWorkoutComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TodaysCompletedWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
