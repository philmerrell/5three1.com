import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleSettingsPage } from './schedule-settings.page';

describe('ScheduleSettingsPage', () => {
  let component: ScheduleSettingsPage;
  let fixture: ComponentFixture<ScheduleSettingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
