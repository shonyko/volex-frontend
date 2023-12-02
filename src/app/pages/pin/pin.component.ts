import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, debounceTime, filter, map, of, switchMap } from 'rxjs';
import { parseId } from 'src/app/utils/parsers';
import { PinsService } from 'src/app/services/pins.service';
import { Pin } from 'src/app/models/pin';
import { PinType } from 'src/app/models/pin-type';
import { DataType } from 'src/app/models/data-type';
import { AgentsService } from 'src/app/services/agents.service';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Agent } from 'src/app/models/agent';

type PinGroup = {
  agent: Agent;
  pins: Pin[];
};

@Component({
  selector: 'app-pin',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatSelectModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './pin.component.html',
  styleUrl: './pin.component.scss',
})
export class PinComponent {
  private route = inject(ActivatedRoute);
  private pinsService = inject(PinsService);
  private agentsService = inject(AgentsService);

  id$ = this.route.paramMap.pipe(
    takeUntilDestroyed(),
    switchMap((params) => {
      const res = parseId(params.get('id'));
      if (res.err) {
        console.error(res.err);
        return EMPTY;
      }
      return of(res.val);
    }),
    filter((id) => id != null),
    map((id) => id as number)
  );

  id = toSignal(this.id$, { initialValue: -1 });

  pin = computed(() => {
    const id = this.id();
    return this.pinsService.getById(id)?.();
  });

  typeName = computed(() => {
    const pin = this.pin();
    if (pin == null) {
      return 'unknown';
    }
    return PinType[pin.pinType].toLowerCase() + 'put';
  });

  dataType = computed(() => {
    const pin = this.pin();
    if (pin == null) {
      return 'unknown';
    }
    return DataType[pin.dataType].toLowerCase().toLocaleLowerCase();
  });

  isInput = computed(() => {
    return this.pin()?.pinType == PinType.IN;
  });

  dataTypes = DataType;

  connectedPins = computed(() =>
    this.pinsService.pins().filter((p) => p().srcPinId == this.pin()?.id)
  );

  getConnectedAgent(pin: Pin) {
    const agent = this.agentsService.getById(pin.agentId);
    return agent();
  }

  disconnect(pin: Pin) {
    this.pinsService.disconnect(pin.id);
  }

  sourcePinId = computed(() => this.pin()?.srcPinId);
  sourcePin = computed(() => {
    const srcId = this.sourcePinId();
    if (srcId == null) {
      return null;
    }
    return this.pinsService.getById(srcId)?.();
  });

  sourcePinEffect = effect(() => {
    this.sourcePinCtrl.setValue(this.sourcePin(), { emitEvent: false });
  });

  sourcePinCtrl: FormControl<Pin | null> = new FormControl<Pin | null>(null);

  onSourceSelected = this.sourcePinCtrl.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe((src) => {
      if (src == null) {
        return;
      }

      const pinId = this.pin()?.id;
      if (pinId == null) {
        return;
      }

      this.pinsService.connect(pinId, src.id);
    });

  pinsFilterCtrl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
  });

  filterValue = toSignal(
    this.pinsFilterCtrl.valueChanges.pipe(takeUntilDestroyed())
  );

  filteredPinGroups = computed<PinGroup[]>(() => {
    const matching_pins = this.pinsService
      .pins()
      .filter(
        (p) =>
          p().pinType == PinType.OUT && p().dataType == this.pin()?.dataType
      )
      .map((p) => p());

    const agentIds = [...new Set(matching_pins.map((p) => p.agentId))];
    const agents = agentIds
      .map((id) => this.agentsService.getById(id)?.())
      .filter((a) => !!a) as Agent[];

    const groups: PinGroup[] = agents.map((agent) => {
      const pins = matching_pins.filter((p) => p.agentId === agent.id);
      return {
        agent,
        pins,
      };
    });

    const search = this.filterValue()?.toLowerCase();
    if (!search) {
      return groups;
    }

    return groups.filter((g) => {
      const showGroup = g.agent.name.includes(search);
      if (!showGroup) {
        g.pins = g.pins.filter((p) => p.name.includes(search));
      }
      return g.pins.length > 0;
    });
  });

  private valueUpdate$ = new Subject<string>();
  onValueChanged = this.valueUpdate$
    .pipe(takeUntilDestroyed(), debounceTime(200))
    .subscribe((val) => {
      const id = this.pin()?.id;
      if (id == null) {
        return;
      }
      this.pinsService.update(id, val);
    });

  onValueChange(value: any) {
    this.valueUpdate$.next(value);
  }
}
