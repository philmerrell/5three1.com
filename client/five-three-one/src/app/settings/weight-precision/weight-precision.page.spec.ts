import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeightPrecisionPage } from './weight-precision.page';

describe('WeightPrecisionPage', () => {
  let component: WeightPrecisionPage;
  let fixture: ComponentFixture<WeightPrecisionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightPrecisionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
