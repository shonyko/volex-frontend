import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agent } from 'src/app/models/agent';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss',
})
export class AgentsComponent {
  static PATH: string = 'agents';

  filterRaw = signal<string>('');
  filter = computed(() => this.filterRaw().trim().toLowerCase());

  agents = signal<Agent[]>([
    {
      id: 1,
      name: 'agentLED',
      blueprint: {
        id: 1,
        displayName: 'LED',
        isHardware: true,
        isValid: true,
      },
      macAddr: '12-34-56-78-90-ab',
    },
    {
      id: 2,
      name: 'agentSWITCH',
      blueprint: {
        id: 2,
        displayName: 'SWITCH',
        isHardware: true,
        isValid: true,
      },
      macAddr: '12-34-56-78-90-ac',
    },
    {
      id: 3,
      name: 'agentTIMER',
      blueprint: {
        id: 3,
        displayName: 'TIMER',
        isHardware: false,
        isValid: true,
      },
      macAddr: 'none',
    },
  ]);

  filteredAgents = computed(() => {
    if (this.filter().length === 0) return this.agents();
    return this.agents().filter(
      (a) =>
        a.name.toLowerCase().includes(this.filter()) ||
        a.macAddr.toLowerCase().includes(this.filter())
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
