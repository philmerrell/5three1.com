import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssistanceWorkEditPage } from './assistance-work-edit.page';

describe('AssistanceWorkEditPage', () => {
  let component: AssistanceWorkEditPage;
  let fixture: ComponentFixture<AssistanceWorkEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistanceWorkEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
