import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IonNav, IonSlides } from '@ionic/angular';
import { LearnMoreComponent } from '../learn-more/learn-more.component';
import { OneRepMaxSettingsComponent } from '../one-rep-max-settings/one-rep-max-settings.component';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss'],
})
export class GetStartedComponent implements OnInit {
  @Input() nav: IonNav;
  @ViewChild(IonSlides) slides: IonSlides;

  constructor() { }

  ngOnInit() {}

  learnMore() {
    this.slides.slideNext();
  }
  setOneRepMaxSettings() {
    this.nav.push(OneRepMaxSettingsComponent, { nav: this.nav });
  }


}
