import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlateCalculatorPage } from './plate-calculator.page';

describe('PlateCalculatorPage', () => {
  let component: PlateCalculatorPage;
  let fixture: ComponentFixture<PlateCalculatorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlateCalculatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
