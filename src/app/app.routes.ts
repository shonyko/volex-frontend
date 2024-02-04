import { Routes } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { AgentsComponent } from './pages/agents/agents.component';
import { RequestsComponent } from './pages/requests/requests.component';
import { BlueprintsComponent } from './pages/blueprints/blueprints.component';
import { AgentComponent } from './pages/agent/agent.component';
import { PinComponent } from './pages/pin/pin.component';
import { AddVirtualAgentComponent } from './pages/add-virtual-agent/add-virtual-agent.component';

export const routes: Routes = [
  {
    path: AgentsComponent.PATH,
    children: [
      { path: '', component: AgentsComponent },
      {
        path: 'add',
        component: AddVirtualAgentComponent,
      },
      {
        path: ':id',
        component: AgentComponent,
      },
      {
        path: ':agentId/pins/:id',
        component: PinComponent,
      },
    ],
  },
  {
    path: BlueprintsComponent.PATH,
    component: BlueprintsComponent,
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
