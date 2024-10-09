import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonBackButton, IonButton, IonButtons, IonCard, IonCheckbox, IonContent, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonTitle, IonToolbar, ToastController } from '@ionic/angular/standalone';
import { ScheduleService, TargetDay } from '../../shared/services/schedule.service';
import { CycleService } from '../../shared/services/cycle.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-schedule-settings',
  templateUrl: './schedule-settings.page.html',
  styleUrls: ['./schedule-settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonCheckbox, FormsModule,
    IonListHeader, IonList, IonItem, IonLabel, IonButton, IonButtons, IonBackButton, IonCard, RouterLink
  ]
})
export class ScheduleSettingsPage implements OnInit {
  targetDays: TargetDay[];
  backButtonDefaultHref = '';
  backButtonText = '';
  warmupEnabled: boolean = true;

  constructor(
    private alertController: AlertController,
    private cycleService: CycleService,
    private router: Router,
    private scheduleService: ScheduleService,
    private toastController: ToastController) { }

  async ngOnInit() {
    this.targetDays = await this.scheduleService.getTargetDays();
    this.warmupEnabled = await this.cycleService.getWarmupEnabled();
    this.setBackButtonDefaults();
  }

  async ionViewDidEnter() {
  }

  handleWarmupToggle(event) {
    const enabled = event.detail.checked;
    this.cycleService.setWarmupEnabled(enabled);
    // if(enabled) {
    //   this.cycleService.addWarmupToWorkouts();
    // } else {
    //   this.cycleService.removeExistingWarmups();
    // }
  }

  selectDay(event) {
    const targetDayIndex = this.targetDays.findIndex(target => target === event.detail.value);
    const targetDay = { name: event.detail.value.name, value: event.detail.value.value, target: !event.detail.value.target };
    this.targetDays.splice(targetDayIndex, 1, targetDay);
    this.scheduleService.setTargetDays(this.targetDays);
  }

  async resetSchedule() {
    await this.cycleService.resetCycles();
    this.scheduleService.recalculateSchedule();
    this.showScheduleResetToast();
  }

  async presentScheduleResetAlert() {
    const alert = await this.alertController.create({
      header: `Are you sure?`,
      subHeader: 'This will reset your current schedule and data.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'OK',
          handler: (data) => {
            this.resetSchedule();
          }
        }
      ]
    });
    alert.present();
  }

  async showScheduleResetToast() {
    const toast = await this.toastController.create({
      color: 'dark',
      message: 'Your schedule has been reset',
      duration: 3000,
      buttons: [
        'OK'
      ]
    });
    toast.present();
  }

  private setBackButtonDefaults() {
    if(window.location.pathname.includes('schedule')) {
      this.backButtonDefaultHref = '/tabs/schedule';
      this.backButtonText = 'Schedule';
    } else {
      //  /tabs/settings
      this.backButtonDefaultHref = '/tabs/settings';
      this.backButtonText = 'Settings';
      
    }
  }

}
