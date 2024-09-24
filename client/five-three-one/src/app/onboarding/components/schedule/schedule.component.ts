import { Component, Input, OnInit } from '@angular/core';
import { IonNav, ModalController } from '@ionic/angular';
import { ScheduleService, TargetDay } from '../../../shared/services/schedule.service';
import { AssistanceTemplatesComponent } from '../assistance-templates/assistance-templates.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  @Input() nav: IonNav;
  targetDays: TargetDay[];

  constructor(
    private modalController: ModalController,
    private scheduleService: ScheduleService) { }

  async ngOnInit() {
    this.targetDays = await this.scheduleService.getTargetDays();
  }

  async ionViewDidEnter() {
  }

  selectDay(event) {
    const targetDayIndex = this.targetDays.findIndex(target => target === event.detail.value);
    const targetDay = { name: event.detail.value.name, value: event.detail.value.value, target: !event.detail.value.target };
    this.targetDays.splice(targetDayIndex, 1, targetDay);
    this.scheduleService.setTargetDays(this.targetDays);
  }

  done() {
    this.modalController.dismiss();
  }

  chooseAssistanceTemplate() {
    this.nav.push(AssistanceTemplatesComponent, { nav: this.nav });
  }

}
