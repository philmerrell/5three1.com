import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OneRepMaxWeightPage } from './one-rep-max-weight.page';

describe('OneRepMaxWeightPage', () => {
  let component: OneRepMaxWeightPage;
  let fixture: ComponentFixture<OneRepMaxWeightPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OneRepMaxWeightPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
