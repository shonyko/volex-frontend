import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AgentsService } from 'src/app/services/agents.service';
import { Agent } from 'src/app/models/agent';
import { BlueprintsService } from 'src/app/services/blueprints.service';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss',
})
export class AgentsComponent {
  static PATH: string = 'agents';

  private agentsService = inject(AgentsService);
  blueprintsService = inject(BlueprintsService);

  filterRaw = signal<string>('');
  filter = computed(() => this.filterRaw().trim().toLowerCase());

  agents = this.agentsService.agents;

  filteredAgents = computed(() => {
    if (this.filter().length === 0) return this.agents();
    return this.agents().filter(
      (a) =>
        a().name.toLowerCase().includes(this.filter()) ||
        a().macAddr?.toLowerCase().includes(this.filter())
    );
  });

  getType(agent: Agent) {
    return agent.macAddr != 'none' ? 'hardware' : 'software';
  }

  getPath(agent: Agent) {
    return `${agent.id}`;
  }

  onFilterChanged(newValue: string) {
    this.filterRaw.set(newValue);
  }

  onAgentSelected(agent: Agent) {
    console.log(agent.id);
  }
}
