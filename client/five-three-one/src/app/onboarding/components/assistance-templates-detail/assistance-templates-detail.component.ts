import { Component, Input, OnInit } from '@angular/core';
import { AssistanceWorkService } from '../../../shared/services/assistance-work.service';
import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CommonModule, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-assistance-templates-detail',
  templateUrl: './assistance-templates-detail.component.html',
  styleUrls: ['./assistance-templates-detail.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonText,
    IonItem,
    IonLabel,
    IonFooter,
    IonButton,
    PercentPipe,
    CommonModule,
  ]
})
export class AssistanceTemplatesDetailComponent implements OnInit {
  @Input() template;

  constructor(private assistanceWorkService: AssistanceWorkService) { }

  ngOnInit() {}

  // selectTemplate() {
  //   this.nav.push(OneRepMaxSettingsComponent, { nav: this.nav });
  // }

  setCurrentTemplate() {
    this.assistanceWorkService.setCurrentAssistanceWorkTemplate(this.template);
    // this.nav.pop();
  }

}
