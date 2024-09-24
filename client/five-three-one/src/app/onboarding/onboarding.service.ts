import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor() { }

  setOnboardingStatus(onboarded: boolean, version: string) {
    const onboardObj = { onboarded: onboarded, version: version};
    return Storage.set({ key: 'onboarding', value: JSON.stringify(onboardObj)});
  }

  async getOnboardingStatus() {
    const status = await Storage.get({ key: 'onboarding'});
    return status.value ? JSON.parse(status.value) : { onboarded: false };
  }

  async removeOnboardingStatus() {
    return await Storage.remove({ key: 'onboarding' });
  }

  setOnboardingAssistanceTemplateStatus(onboarded: boolean) {
    const onboardObj = { onboarded: onboarded };
    return Storage.set({ key: 'onboarding-assistance-template', value: JSON.stringify(onboardObj) });
  }

  async getOnboardingAssistanceTemplateStatus() {
    const status = await Storage.get({ key: 'onboarding-assistance-template' });
    return status.value ? JSON.parse(status.value) : { onboarded: false }
  }

  async removeOnboardingAssistanceTemplateStatus() {
    return await Storage.remove({ key: 'onboarding-assistance-template' });
  }
}
