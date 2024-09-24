import { Component, Input, OnInit } from '@angular/core';
import { IonNav } from '@ionic/angular';
import { AssistanceWorkService } from '../../../shared/services/assistance-work.service';

@Component({
  selector: 'app-assistance-templates-detail',
  templateUrl: './assistance-templates-detail.component.html',
  styleUrls: ['./assistance-templates-detail.component.scss'],
})
export class AssistanceTemplatesDetailComponent implements OnInit {
  @Input() nav: IonNav;
  @Input() template;

  constructor(private assistanceWorkService: AssistanceWorkService) { }

  ngOnInit() {}

  // selectTemplate() {
  //   this.nav.push(OneRepMaxSettingsComponent, { nav: this.nav });
  // }

  setCurrentTemplate() {
    this.assistanceWorkService.setCurrentAssistanceWorkTemplate(this.template);
    this.nav.pop();
  }

}
