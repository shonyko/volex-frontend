import {
  Component,
  HostBinding,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AgentsService } from 'src/app/services/agents.service';
import { BlueprintsService } from 'src/app/services/blueprints.service';
import { ParamsService } from 'src/app/services/params.service';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss',
})
export class AgentComponent implements OnInit {
  @HostBinding('class') controlClass = '';

  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private agentsService = inject(AgentsService);
  private blueprintsService = inject(BlueprintsService);
  private paramsService = inject(ParamsService);

  agentId = signal<number | null>(null);
  agent = computed(() => {
    const id = this.agentId();
    if (id == null) {
      return null;
    }
    const agent = this.agentsService.getById(id);
    return agent?.();
  });
  blueprint = computed(() => {
    const agent = this.agent();
    if (agent == null) {
      return null;
    }
    return this.blueprintsService.getById(agent.blueprintId)?.();
  });
  params = computed(() => {
    const id = this.agentId();
    if (id == null) {
      return [];
    }
    return this.paramsService.params().filter((p) => p().agentId == id);
  });

  constructor() {}

  private back() {
    this.location.back();
  }

  onBack() {
    this.controlClass = 'inactive';
    setTimeout(this.back.bind(this), 215);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((map) => {
      const id_str = map.get('id');
      if (id_str == null) {
        console.error('no id found');
        return;
      }
      const id = Number(id_str);
      if (id == null || isNaN(id)) {
        console.error('invalid id');
        return;
      }
      this.agentId.set(id);
    });
  }
}
