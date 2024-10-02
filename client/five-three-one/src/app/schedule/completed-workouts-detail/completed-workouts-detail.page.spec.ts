import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletedWorkoutsDetailPage } from './completed-workouts-detail.page';

describe('CompletedWorkoutsDetailPage', () => {
  let component: CompletedWorkoutsDetailPage;
  let fixture: ComponentFixture<CompletedWorkoutsDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedWorkoutsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
