import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, ModalController, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { square, calendar, barChart, settings } from 'ionicons/icons';
import { OnboardingPage } from '../onboarding/onboarding.page';
import { OnboardingService } from '../onboarding/onboarding.service';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private onboardingService: OnboardingService) {
    addIcons({ calendar, barChart, settings });
  }

  async ngOnInit() {
    const onboardingStatus = await this.onboardingService.getOnboardingStatus();
    if (!onboardingStatus.onboarded) {
      this.presentOnboarding();
    }
  }

  private async presentOnboarding() {
    const modal = await this.modalController.create({
      component: OnboardingPage,
      presentingElement: this.routerOutlet.nativeEl,
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data.onboarded) {
      this.onboardingService.setOnboardingStatus(true, '1');
    }
  }
}
