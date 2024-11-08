import { Component, Input, OnInit } from '@angular/core';
import { PRAttempt } from '../../../shared/services/personal-record.service';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonRow, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trophy } from 'ionicons/icons';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-personal-records',
  templateUrl: './personal-records.component.html',
  styleUrls: ['./personal-records.component.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonText,
    DecimalPipe
  ]
})
export class PersonalRecordsComponent implements OnInit {
  @Input() records: PRAttempt[];
  @Input() unit: 'lb' | 'kg';
  
  constructor() {
    addIcons({trophy})
   }

  ngOnInit() {}

}
