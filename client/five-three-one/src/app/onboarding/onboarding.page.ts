import { Component, OnInit } from '@angular/core';
import { GetStartedComponent } from './components/get-started/get-started.component';
import { IonNav } from '@ionic/angular/standalone';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [
    GetStartedComponent,
    IonNav
  ]
})
export class OnboardingPage implements OnInit {
  getStartedComponent = GetStartedComponent;
  constructor() { }

  async ngOnInit() {
    
  }

}
