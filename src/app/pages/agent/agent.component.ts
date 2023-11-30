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
import { PinsService } from 'src/app/services/pins.service';
import { DataType } from 'src/app/models/data-type';
import { Param } from 'src/app/models/param';
import { Pin } from 'src/app/models/pin';
import { PinType } from 'src/app/models/pin-type';

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
  private pinsService = inject(PinsService);

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

  pins = computed(() => {
    const id = this.agentId();
    if (id == null) {
      return [];
    }
    return this.pinsService.params().filter((p) => p().agentId == id);
  });

  constructor() {}

  private back() {
    this.location.back();
  }

  onBack() {
    this.controlClass = 'inactive';
    setTimeout(this.back.bind(this), 215);
  }

  getDataTypeName(param: Param) {
    return DataType[param.dataType].toLowerCase();
  }

  getPinTypeName(pin: Pin) {
    return PinType[pin.pinType].toLowerCase() + 'put';
  }

  isPinConnected(pin: Pin) {
    return pin.srcPinId != null;
  }

  getPinConnection(pin: Pin) {
    if (pin.srcPinId == null) {
      return 'Disconnected';
    }

    const src = this.pinsService.getById(pin.srcPinId);
    if (src() == null) {
      return 'Source not found';
    }

    const agent = this.agentsService.getById(src()!.agentId);
    return `${agent()?.name} / ${src()!.name}`;
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
