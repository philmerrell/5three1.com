import { Component, OnInit } from '@angular/core';
import { OneRepMaxSettingsComponent } from '../one-rep-max-settings/one-rep-max-settings.component';
import { IonButton, IonCard, IonContent, IonFooter, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonNav, IonNavLink, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barbell, body, calendar, options, refresh } from 'ionicons/icons';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss'],
  standalone: true,
  imports: [
    IonFooter,
    IonCard,
    IonContent,
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonIcon,
    IonNavLink,
    IonButton,
    IonText
  ]
})
export class GetStartedComponent implements OnInit {
  oneRepMaxSettings = OneRepMaxSettingsComponent

  constructor() {
    addIcons({ calendar, body, options, refresh, barbell });
  }

  ngOnInit() {}


}
