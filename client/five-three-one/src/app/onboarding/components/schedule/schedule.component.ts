import { Component, Input, OnInit } from '@angular/core';
import { AssistanceTemplatesComponent } from '../assistance-templates/assistance-templates.component';
import { ScheduleService, TargetDay } from '../../../shared/services/schedule.service';
import { IonBackButton, IonButton, IonButtons, IonCheckbox, IonContent, IonFooter, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonNavLink, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonCheckbox,
    IonFooter,
    IonButton,
    CommonModule,
    IonNavLink
  ]
})
export class ScheduleComponent implements OnInit {
  targetDays: TargetDay[] = [];
  assistanceTemplate = AssistanceTemplatesComponent;

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
    // this.nav.push(AssistanceTemplatesComponent, { nav: this.nav });
  }

}
