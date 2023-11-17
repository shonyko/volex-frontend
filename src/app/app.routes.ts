import { Routes } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { AgentsComponent } from './pages/agents/agents.component';

export const routes: Routes = [
  {
    path: AgentsComponent.PATH,
    component: AgentsComponent,
  },
  {
    path: SettingsComponent.PATH,
    component: SettingsComponent,
  },
];
