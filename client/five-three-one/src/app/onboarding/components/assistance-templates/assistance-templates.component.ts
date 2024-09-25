import { Component, Input, OnInit } from '@angular/core';
import { IonNav } from '@ionic/angular';
import { AssistanceWorkService } from '../../../shared/services/assistance-work.service';
import { AssistanceTemplatesDetailComponent } from '../assistance-templates-detail/assistance-templates-detail.component';
import { BehaviorComponent } from '../behavior/behavior.component';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CommonModule, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-assistance-templates',
  templateUrl: './assistance-templates.component.html',
  styleUrls: ['./assistance-templates.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonCardTitle,
    IonIcon,
    IonCardHeader,
    IonCardContent,
    IonButton,
    IonFooter,
    PercentPipe,
    CommonModule
  ]
})
export class AssistanceTemplatesComponent implements OnInit {
  // @Input() nav: IonNav;
  assistanceWork;
  templates;

  constructor(private assistanceWorkService: AssistanceWorkService) { }

  async ngOnInit() {
    this.templates = this.assistanceWorkService.getAllTemplates();
  }
  
  async ionViewDidEnter() {
    this.assistanceWork = await this.assistanceWorkService.getCurrentAssistanceWorkTemplate();
  }

  viewTemplate(template) {
    // this.nav.push(AssistanceTemplatesDetailComponent, { nav: this.nav, template });
  }

  setCurrentTemplate(event, template) {
    event.stopPropagation();
    this.assistanceWorkService.setCurrentAssistanceWorkTemplate(template);
    this.assistanceWork = template;
  }
  
  next() {
    // this.nav.push(BehaviorComponent, { nav: this.nav });
  }

}
