import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssistanceTemplatesDetailComponent } from './assistance-templates-detail.component';

describe('AssistanceTemplatesDetailComponent', () => {
  let component: AssistanceTemplatesDetailComponent;
  let fixture: ComponentFixture<AssistanceTemplatesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistanceTemplatesDetailComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssistanceTemplatesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
