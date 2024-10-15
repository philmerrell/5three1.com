import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateAssistanceWorkTemplateComponent } from './create-assistance-work-template.page';

describe('CreateAssistanceWorkTemplateComponent', () => {
  let component: CreateAssistanceWorkTemplateComponent;
  let fixture: ComponentFixture<CreateAssistanceWorkTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAssistanceWorkTemplateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAssistanceWorkTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
