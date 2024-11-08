import { Component, Input, OnInit } from '@angular/core';
import { PRAttempt } from '../../../shared/services/personal-record.service';
import { addIcons } from 'ionicons';
import { barbell, trophy } from 'ionicons/icons';
import { IonCard, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonRow, IonText } from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-pr-attempts',
  templateUrl: './pr-attempts.component.html',
  styleUrls: ['./pr-attempts.component.scss'],
  standalone: true,
  imports: [
    DecimalPipe,
    TimeAgoPipe,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonList,
    IonIcon,
    IonText,
    IonLabel
  ]
})
export class PrAttemptsComponent implements OnInit {
  @Input() attempts: PRAttempt[];
  @Input() unit: 'lb' | 'kg';

  constructor() {
    addIcons({trophy, barbell})
  }

  ngOnInit() {}

}
