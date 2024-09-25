import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Preferences } from '@capacitor/preferences';



@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor() { }

  setOnboardingStatus(onboarded: boolean, version: string) {
    const onboardObj = { onboarded: onboarded, version: version};
    return Preferences.set({ key: 'onboarding', value: JSON.stringify(onboardObj)});
  }

  async getOnboardingStatus() {
    const status = await Preferences.get({ key: 'onboarding'});
    return status.value ? JSON.parse(status.value) : { onboarded: false };
  }

  async removeOnboardingStatus() {
    return await Preferences.remove({ key: 'onboarding' });
  }

  setOnboardingAssistanceTemplateStatus(onboarded: boolean) {
    const onboardObj = { onboarded: onboarded };
    return Preferences.set({ key: 'onboarding-assistance-template', value: JSON.stringify(onboardObj) });
  }

  async getOnboardingAssistanceTemplateStatus() {
    const status = await Preferences.get({ key: 'onboarding-assistance-template' });
    return status.value ? JSON.parse(status.value) : { onboarded: false }
  }

  async removeOnboardingAssistanceTemplateStatus() {
    return await Preferences.remove({ key: 'onboarding-assistance-template' });
  }
}
