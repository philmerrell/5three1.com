import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export interface KeepScreenOnPlugin {
  enable(): Promise<SetResult>;
  disable(): Promise<SetResult>;
  getState(): Promise<SetResult>;
}

export class State{
  constructor(public isEnabled: boolean) {
  }
}

export type SetResult = State

import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  keepScreenOn: { isEnabled: boolean };
  
  constructor(private platform: Platform) { }

  async enableKeepScreenOn() {
    if (this.platform.is('capacitor')) {
      const keepScreenOn = await this.getKeepScreenOnSetting();
      if (keepScreenOn.isEnabled) {
        // KeepScreenOn.enable();
      }
    }
  }

  async disableKeepScreenOn() {
    if (this.platform.is('capacitor')) {
      const keepScreenOn = await this.getKeepScreenOnSetting();
      if (keepScreenOn.isEnabled) {
        // KeepScreenOn.disable();
      }
    }
  }

  getState() {
    if (this.platform.is('capacitor')) {
      // return KeepScreenOn.getState();
    }
  }

  setKeepScreenOnSetting(value: boolean) {
    this.keepScreenOn = { isEnabled: value };
    return Preferences.set({ key: 'keepScreenOn', value: JSON.stringify({ isEnabled: value })});
  }

  async getKeepScreenOnSetting(): Promise<{ isEnabled: boolean}> {
    if (!this.keepScreenOn) {
      const result = await Preferences.get({ key: 'keepScreenOn'});
      const keepScreenOn = result.value ? JSON.parse(result.value) : { isEnabled: false };
      this.keepScreenOn = keepScreenOn;
      return this.keepScreenOn
    } else {
      return this.keepScreenOn
    }
  }

}
