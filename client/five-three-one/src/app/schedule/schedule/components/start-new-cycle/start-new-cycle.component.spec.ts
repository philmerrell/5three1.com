import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StartNewCycleComponent } from './start-new-cycle.component';

describe('StartNewCycleComponent', () => {
  let component: StartNewCycleComponent;
  let fixture: ComponentFixture<StartNewCycleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartNewCycleComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StartNewCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
