import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingPercentPage } from './training-percent.page';

describe('TrainingPercentPage', () => {
  let component: TrainingPercentPage;
  let fixture: ComponentFixture<TrainingPercentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingPercentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
