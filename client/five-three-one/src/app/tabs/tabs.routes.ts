import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'schedule',
        loadComponent: () => 
          import('../schedule/schedule/schedule.page').then( m => m.SchedulePage)
      },
      {
        path: 'schedule/schedule-settings',
        loadComponent: () => 
          import('../settings/schedule-settings/schedule-settings.page').then( m => m.ScheduleSettingsPage)
      },
      {
        path: 'schedule/workout/:id',
        loadComponent: () => 
          import('../schedule/workout/workout.page').then( m => m.WorkoutPage)
      },
      {
        path: 'schedule/completed-workouts',
        loadComponent: () => import('../schedule/completed-workouts/completed-workouts.page').then( m => m.CompletedWorkoutsPage)
      },
      {
        path: 'schedule/completed-workouts/:id',
        loadComponent: () => import('../schedule/completed-workouts-detail/completed-workouts-detail.page').then( m => m.CompletedWorkoutsDetailPage)
      },
      {
        path: 'schedule/workout/:id/assistance-work/:lift',
        loadComponent: () => import('../schedule/assistance-work-edit/assistance-work-edit.page').then( m => m.AssistanceWorkEditPage)
      },
      {
        path: 'settings',
        loadComponent: () => import('../settings/settings/settings.page').then( m => m.SettingsPage)
      },
      {
        path: 'settings/one-rep-max-weight',
        loadComponent: () => import('../settings/one-rep-max-weight/one-rep-max-weight.page').then( m => m.OneRepMaxWeightPage)
      },
      {
        path: 'settings/schedule',
        loadComponent: () => import('../settings/schedule-settings/schedule-settings.page').then( m => m.ScheduleSettingsPage)
      },
      {
        path: 'settings/completed-workouts',
        loadComponent: () => import('../schedule/completed-workouts/completed-workouts.page').then( m => m.CompletedWorkoutsPage)
      },
      {
        path: 'settings/completed-workouts/:id',
        loadComponent: () => import('../schedule/completed-workouts-detail/completed-workouts-detail.page').then( m => m.CompletedWorkoutsDetailPage)
      },
      {
        path: 'settings/weight-precision',
        loadComponent: () => import('../settings/weight-precision/weight-precision.page').then( m => m.WeightPrecisionPage)
      },
      {
        path: 'settings/training-percent',
        loadComponent: () => import('../settings/training-percent/training-percent.page').then( m => m.TrainingPercentPage)
      },
      {
        path: 'settings/plate-calculator',
        loadComponent: () => import('../settings/plate-calculator/plate-calculator.page').then( m => m.PlateCalculatorPage)
      },
      {
        path: 'settings/assistance-work',
        loadComponent: () => import('../settings/assistance-work/assistance-work.page').then( m => m.AssistanceWorkPage)
      },
      {
        path: 'settings/assistance-work/create-assistance-work-template',
        loadComponent: () => import('../settings/create-assistance-work-template/create-assistance-work-template.page').then( m => m.CreateAssistanceWorkTemplatePage)
      },
      {
        path: 'settings/assistance-work-template/:id',
        loadComponent: () => import('../settings/assistance-work-template/assistance-work-template.page').then( m => m.AssistanceWorkTemplatePage)
      },
      {
        path: 'progress',
        loadComponent: () => import('../progress/progress.page').then( m => m.ProgressPage)
      },
      {
        path: '',
        redirectTo: '/tabs/schedule',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/schedule',
    pathMatch: 'full',
  },
];
