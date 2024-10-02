import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletedWorkoutsPage } from './completed-workouts.page';

describe('CompletedWorkoutsPage', () => {
  let component: CompletedWorkoutsPage;
  let fixture: ComponentFixture<CompletedWorkoutsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedWorkoutsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
