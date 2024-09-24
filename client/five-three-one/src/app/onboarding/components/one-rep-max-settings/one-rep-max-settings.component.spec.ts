import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OneRepMaxSettingsComponent } from './one-rep-max-settings.component';

describe('OneRepMaxSettingsComponent', () => {
  let component: OneRepMaxSettingsComponent;
  let fixture: ComponentFixture<OneRepMaxSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneRepMaxSettingsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OneRepMaxSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
