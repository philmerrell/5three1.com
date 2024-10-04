import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssistanceWorkTemplatePage } from './assistance-work-template.page';

describe('AssistanceWorkTemplatePage', () => {
  let component: AssistanceWorkTemplatePage;
  let fixture: ComponentFixture<AssistanceWorkTemplatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistanceWorkTemplatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
