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
          import('../schedule/schedule-settings/schedule-settings.page').then( m => m.ScheduleSettingsPage)
      },
      {
        path: 'schedule/workout/:id',
        loadComponent: () => 
          import('../schedule/workout/workout.page').then( m => m.WorkoutPage)
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
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
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
