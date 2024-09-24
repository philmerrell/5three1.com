import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnboardingPageRoutingModule } from './onboarding-routing.module';

import { OnboardingPage } from './onboarding.page';
import { GetStartedComponent } from './components/get-started/get-started.component';
import { OneRepMaxSettingsComponent } from './components/one-rep-max-settings/one-rep-max-settings.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { AssistanceTemplatesComponent } from './components/assistance-templates/assistance-templates.component';
import { LearnMoreComponent } from './components/learn-more/learn-more.component';
import { AssistanceTemplatesDetailComponent } from './components/assistance-templates-detail/assistance-templates-detail.component';
import { AppBehaviorPageModule } from '../app-behavior/app-behavior.module';
import { BehaviorComponent } from './components/behavior/behavior.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OnboardingPageRoutingModule
  ],
  declarations: [
    OnboardingPage,
    LearnMoreComponent,
    GetStartedComponent,
    OneRepMaxSettingsComponent,
    ScheduleComponent,
    AssistanceTemplatesComponent,
    AssistanceTemplatesDetailComponent,
    BehaviorComponent
  ]
})
export class OnboardingPageModule {}
