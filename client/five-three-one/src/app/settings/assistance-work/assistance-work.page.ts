import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AssistanceWorkService, AssistanceWorkTemplate } from '../../shared/services/assistance-work.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-assistance-work',
  templateUrl: './assistance-work.page.html',
  styleUrls: ['./assistance-work.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonListHeader, IonLabel, IonItem, IonButtons, IonBackButton, RouterLink]
})
export class AssistanceWorkPage implements OnInit {
  // objectKeys = Object.keys
  // Lifts = Lifts
  assistanceWork: AssistanceWorkTemplate;
  templates: AssistanceWorkTemplate[];
  sub: Subscription;

  constructor(private assistanceWorkService: AssistanceWorkService) { }

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
