import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, debounceTime, filter, map, of, switchMap } from 'rxjs';
import { hexToRgb, parseId, parseValue } from 'src/app/utils/parsers';
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
    // TODO: maybe add loading animation
    this.pinsService.disconnect(pin.id).subscribe({
      next() {
        console.log('success');
      },
      error(err) {
        console.log('error while unsetting source: ', err);
      },
    });
  }

  sourcePinId = computed(() => this.pin()?.srcPinId);
  sourcePin = computed(() => {
    const srcId = this.sourcePinId();
    if (srcId == null) {
      return null;
    }
    return this.pinsService.getById(srcId)?.();
  });

  sourcePinLabel = computed(() => {
    const src = this.sourcePin();
    if (src == null) {
      return null;
    }

    const agent = this.agentsService.getById(src.agentId)();
    if (agent == null) {
      return null;
    }

    return agent.name;
  });

  sourcePinEffect = effect(() => {
    const srcId = this.sourcePin()?.id ?? null;
    this.sourcePinCtrl.setValue(srcId, { emitEvent: false });
  });

  sourcePinCtrl: FormControl<number | null> = new FormControl<number | null>(
    null
  );

  onSourceSelected = this.sourcePinCtrl.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe((srcId) => {
      if (srcId == null) {
        return;
      }

      const pinId = this.pin()?.id;
      if (pinId == null) {
        return;
      }

      this.pinsService.connect(pinId, srcId).subscribe({
        next() {
          console.log('success');
        },
        error(err) {
          console.log('error while setting source: ', err);
        },
      });
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

  pinValueEffect = effect(() => {
    const pin = this.pin();
    if (pin == null) {
      return;
    }
    this.manualValueCtrl.setValue(parseValue(pin), { emitEvent: false });
  });

  // I don't like this
  srcPinValueEffect = effect(() => {
    const src = this.sourcePin();
    if (src == null) {
      return;
    }
    this.manualValueCtrl.setValue(parseValue(src), { emitEvent: false });
  });

  manualValueCtrl = new FormControl<any>({ value: null, disabled: false });
  onValueChanged = this.manualValueCtrl.valueChanges
    .pipe(takeUntilDestroyed(), debounceTime(200))
    .subscribe((val) => {
      const pin = this.pin();
      if (pin == null) {
        return;
      }
      if (pin.dataType == DataType.RGB) {
        val = hexToRgb(val);
      }
      this.pinsService.update(pin.id, val);
    });
}
