import { Component, OnInit, ViewChild } from '@angular/core';
import { IonNav } from '@ionic/angular';
import { GetStartedComponent } from './components/get-started/get-started.component';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  @ViewChild("nav", { static: true }) nav: IonNav;

  constructor() { }

  async ngOnInit() {
    await this.nav.setRoot(GetStartedComponent, { nav: this.nav });
  }

}
