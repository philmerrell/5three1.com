import { Injectable } from '@angular/core';
import { Haptics, NotificationType } from '@capacitor/haptics';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class HapticService {

  constructor(private platform: Platform) { }

  notification(notificationType: 'SUCCESS' | 'WARNING' | 'ERROR') {
    
      const type = NotificationType[notificationType];
      Haptics.notification({
        type
      });
  
  }

  vibrate() {
    Haptics.vibrate();
  }
}
