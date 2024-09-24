import { Component, Input, OnInit } from '@angular/core';
import { IonNav } from '@ionic/angular';
import { AppBehaviorPage } from '../../../app-behavior/app-behavior.page';
import { AssistanceWorkService } from '../../../shared/services/assistance-work.service';
import { AssistanceTemplatesDetailComponent } from '../assistance-templates-detail/assistance-templates-detail.component';
import { BehaviorComponent } from '../behavior/behavior.component';

@Component({
  selector: 'app-assistance-templates',
  templateUrl: './assistance-templates.component.html',
  styleUrls: ['./assistance-templates.component.scss'],
})
export class AssistanceTemplatesComponent implements OnInit {
  @Input() nav: IonNav;
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
    this.nav.push(AssistanceTemplatesDetailComponent, { nav: this.nav, template });
  }

  setCurrentTemplate(event, template) {
    event.stopPropagation();
    this.assistanceWorkService.setCurrentAssistanceWorkTemplate(template);
    this.assistanceWork = template;
  }
  
  next() {
    this.nav.push(BehaviorComponent, { nav: this.nav });
  }

}
