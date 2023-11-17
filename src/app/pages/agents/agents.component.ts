import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agent } from 'src/app/models/agent';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
      },
      macAddr: '12-34-56-78-90-ab',
    },
    {
      id: 2,
      name: 'agentSWITCH',
      blueprint: {
        id: 2,
        displayName: 'SWITCH',
      },
      macAddr: '12-34-56-78-90-ac',
    },
    {
      id: 3,
      name: 'agentTIMER',
      blueprint: {
        id: 3,
        displayName: 'TIMER',
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

  onFilterChanged(newValue: string) {
    this.filterRaw.set(newValue);
  }

  getType(agent: Agent) {
    return agent.macAddr != 'none' ? 'hardware' : 'software';
  }
}
