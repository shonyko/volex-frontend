import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AgentsService } from 'src/app/services/agents.service';
import { BlueprintsService } from 'src/app/services/blueprints.service';
import { ParamsService } from 'src/app/services/params.service';
import { PinsService } from 'src/app/services/pins.service';
import { Pin } from 'src/app/models/pin';
import { PinType } from 'src/app/models/pin-type';
import { AgentParamComponent } from '../../components/agents/agent-param/agent-param.component';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, filter, map, of, switchMap } from 'rxjs';
import { parseId } from 'src/app/utils/parsers';

@Component({
  selector: 'app-agent',
  standalone: true,
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss',
  imports: [CommonModule, AgentParamComponent, RouterLink],
})
export class AgentComponent {
  private route = inject(ActivatedRoute);
  private agentsService = inject(AgentsService);
  private blueprintsService = inject(BlueprintsService);
  private paramsService = inject(ParamsService);
  private pinsService = inject(PinsService);

  idParam$ = this.route.paramMap.pipe(
    takeUntilDestroyed(),
    switchMap((params) => {
      const res = parseId(params.get('id'));
      if (res.err) {
        console.error(res.err);
        // TODO: handle it (?)
        return EMPTY;
      }
      return of(res.val);
    })
  );

  id$ = this.idParam$.pipe(
    filter((id) => id != null),
    map((id) => id as number)
  );

  agentId = toSignal(this.id$, { initialValue: -1 });

  agent = computed(() => {
    const id = this.agentId();
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
    return this.paramsService.params().filter((p) => p().agentId == id);
  });

  pins = computed(() => {
    const id = this.agentId();
    return this.pinsService.pins().filter((p) => p().agentId == id);
  });

  getPinTypeName(pin: Pin) {
    return PinType[pin.pinType].toLowerCase() + 'put';
  }

  isPinConnected(pin: Pin) {
    return pin.pinType == PinType.OUT || pin.srcPinId != null;
  }

  getPinConnection(pin: Pin) {
    if (pin.pinType == PinType.OUT) {
      const connections = this.pinsService
        .pins()
        .filter((p) => p().srcPinId == pin.id).length;
      return `to ${connections} pins`;
    }

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

  getPinPath(pin: Pin) {
    return `pins/${pin.id}`;
  }
}
