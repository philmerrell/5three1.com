import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { PushNotificationService } from '../../../shared/services/push-notification.service';
import { ScreenService } from '../../../shared/services/screen.service';

@Component({
  selector: 'app-behavior',
  templateUrl: './behavior.component.html',
  styleUrls: ['./behavior.component.scss'],
})
export class BehaviorComponent implements OnInit {
  alertPresented = false;
  restTimerNotificationsSetting = {
    isEnabled: false
  };

  keepScreenOn = {
    isEnabled: false
  };
  
  constructor(
    private screenService: ScreenService,
    private pushNotificationService: PushNotificationService,
    private modalController: ModalController,
    private alertController: AlertController) { }

  async ngOnInit() {
    this.restTimerNotificationsSetting = await this.pushNotificationService.getRestTimerNotificationsEnabledSetting();
    this.keepScreenOn = await this.screenService.getKeepScreenOnSetting();
  }

  finish() {
    this.modalController.dismiss({ onboarded: true });
  }

  async handleNotificationsToggle() {
    const areEnabled = await this.pushNotificationService.areEnabled();
    if (areEnabled.value) {
      this.pushNotificationService.setRestTimerNotificationsEnabledSetting(this.restTimerNotificationsSetting.isEnabled)
    } else {
      const permission = await this.pushNotificationService.requestPermission();
      if (permission.granted) {
        this.pushNotificationService.setRestTimerNotificationsEnabledSetting(true);
      } else {
        // Permission not granted
        // Open alert informing user to open settings and enable push notifications for app.
        if (!this.alertPresented) {
          this.presentNotificationsDisabledAlert();
          this.restTimerNotificationsSetting.isEnabled = false;
          this.pushNotificationService.setRestTimerNotificationsEnabledSetting(false);
          this.alertPresented = true;
        }
      }

    }
  }

  async presentNotificationsDisabledAlert() {
    const alert = await this.alertController.create({
      header: 'Notifications Disabled',
      subHeader: 'Would you like to turn notifications on in Settings?',
      buttons: [
        { 
          text: 'Cancel',
          handler: () => {
            this.alertPresented = false;
          }
        },
        {
          text: 'Settings',
          handler: () => {
            this.alertPresented = false;
            this.openSettings();
          }
        }
      ]
    });
    return await alert.present();
  }

  async openSettings() {
    this.pushNotificationService.openSettings();
  }

  handleScreenToggle() {
    this.screenService.setKeepScreenOnSetting(this.keepScreenOn.isEnabled);
  }


}
