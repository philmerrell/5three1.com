import { Component, OnInit } from '@angular/core';
import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonRouterOutlet, IonText, IonTitle, IonToolbar, ModalController, ToastController } from '@ionic/angular/standalone';
import { AssistanceWorkService, AssistanceWorkTemplate } from '../../shared/services/assistance-work.service';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { WeightService } from '../../shared/services/weight.service';
import { EditLiftComponent } from '../../shared/components/edit-lift-modal/edit-lift/edit-lift.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-assistance-work-template',
  templateUrl: './assistance-work-template.page.html',
  styleUrls: ['./assistance-work-template.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonListHeader, IonText, IonItem, IonFooter, IonButton, AsyncPipe, IonLabel]
})
export class AssistanceWorkTemplatePage implements OnInit {
  template: AssistanceWorkTemplate;
  isCurrentTemplate: boolean = true;
  weightUnit$: Observable<{unit: 'lb' | 'kg'}>;
  sub: Subscription;

  constructor(
    private assistanceWorkService: AssistanceWorkService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private routerOutlet: IonRouterOutlet,
    private toastController: ToastController,
    private weightService: WeightService) { }

  ngOnInit() {
    this.weightUnit$ = this.weightService.getWeightUnitObservable();
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getTemplate(id);
    });
    
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async getTemplate(id: string) {
    const templates = this.assistanceWorkService.getAllTemplates();
    const template = templates.find(template => template.id === id);
    this.sub = this.assistanceWorkService.getCurrentAssistanceWorkObservable().subscribe(current => {
      this.isCurrentTemplate = current.id === template.id;
      this.template = this.isCurrentTemplate ? current : template;
    });
  }

  setCurrentTemplate() {
    this.assistanceWorkService.setCurrentAssistanceWorkTemplate(this.template);
    this.showToast();
  }

  async showToast() {
    const toast = await this.toastController.create({
      message: 'Your template has been set',
      duration: 3000,
      color: 'dark'
    });
    toast.present();
  }

  async openExerciseModal(unit: 'lb' | 'kg', key: 'squat' | 'bench' | 'deadlift' | 'shoulderPress', lift?) {
    const modal = await this.modalController.create({
      component: EditLiftComponent,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        lift,
        unit
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data && data.action === 'add') {
      // this.lifts.push(data.lift);
    }
    if (data && data.action === 'edit') {
      if (data.applyToAll) {
        this.updateAllLiftsOfType(data, key);
      } else {
        this.updateOneLift(data, key);
      }
    }
  }

  saveAssistanceWork() {
    this.assistanceWorkService.setCurrentAssistanceWorkTemplate(this.template);
    this.showToast();
  }

  private updateAllLiftsOfType(data, key) {
    const similarLifts = this.template.lifts[key].filter(lift => lift.name === data.lift.name);
    for (let lift of similarLifts) {
      lift.barbell = data.lift.barbell;
      lift.percentage = data.lift.percentage;
      lift.reps = data.lift.reps;
      lift.weight = data.lift.weight;
      // lift.complete = lift.complete
    }
    this.saveAssistanceWork();
  }

  private updateOneLift(data, key) {
    const index = this.template.lifts[key].findIndex(lift => lift.id === data.lift.id);
    this.template.lifts[key].splice(index, 1, data.lift);
    this.saveAssistanceWork();
  }
}
