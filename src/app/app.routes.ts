import { Routes } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { AgentsComponent } from './pages/agents/agents.component';
import { RequestsComponent } from './pages/requests/requests.component';

export const routes: Routes = [
  {
    path: AgentsComponent.PATH,
    component: AgentsComponent,
  },
  {
    path: RequestsComponent.PATH,
    component: RequestsComponent,
  },
  {
    path: SettingsComponent.PATH,
    component: SettingsComponent,
  },
];
