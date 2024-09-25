import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SetResult } from './screen.service';


@Injectable({
  providedIn: 'root'
})
export class AudioService {
  audio = new Audio('/assets/timer.mp3');

  constructor(private platform: Platform) { }

  playTimerSound() {
    const isCapacitor = this.platform.is('capacitor');
    // if (isCapacitor) {
    //   console.log('play native sound')
    //   AudioPlugin.playTimerSound();
    // } else {
      // On the web
      this.audio.play()
    // }
  }
}
