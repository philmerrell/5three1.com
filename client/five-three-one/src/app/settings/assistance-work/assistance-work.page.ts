import { Component, OnInit } from '@angular/core';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonRouterOutlet, IonText, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { AssistanceWorkService, AssistanceWorkTemplate } from '../../shared/services/assistance-work.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-assistance-work',
  templateUrl: './assistance-work.page.html',
  styleUrls: ['./assistance-work.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonListHeader, IonLabel, IonItem, IonButtons, IonBackButton, RouterLink, IonButton, IonIcon, IonText, RouterLink]
})
export class AssistanceWorkPage implements OnInit {
  assistanceWork: AssistanceWorkTemplate;
  templates: AssistanceWorkTemplate[];
  sub: Subscription;

  constructor(
    private assistanceWorkService: AssistanceWorkService) {
    addIcons({add})
  }

  async ngOnInit() {
    this.sub = this.assistanceWorkService.getCurrentAssistanceWorkObservable().subscribe(current => {
      this.assistanceWork = current;
      const templates = this.assistanceWorkService.getAllTemplates();
      this.templates = templates.filter(t => t.id !== this.assistanceWork.id);
    });
    // this.assistanceWork = await this.assistanceWorkService.getCurrentAssistanceWorkTemplate();
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

}
