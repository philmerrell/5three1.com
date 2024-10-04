import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssistanceWorkPage } from './assistance-work.page';

describe('AssistanceWorkPage', () => {
  let component: AssistanceWorkPage;
  let fixture: ComponentFixture<AssistanceWorkPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistanceWorkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
