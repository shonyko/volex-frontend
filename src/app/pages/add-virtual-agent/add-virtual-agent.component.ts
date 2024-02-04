import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { BlueprintsService } from 'src/app/services/blueprints.service';
import { Blueprint } from 'src/app/models/blueprint';
import { RouterLink } from '@angular/router';
import { AgentsService } from 'src/app/services/agents.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-virtual-agent',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './add-virtual-agent.component.html',
  styleUrl: './add-virtual-agent.component.scss',
})
export class AddVirtualAgentComponent implements OnDestroy {
  private blueprintsService = inject(BlueprintsService);
  private agentsService = inject(AgentsService);
  private location = inject(Location);

  filterRaw = signal<string>('');
  filter = computed(() => this.filterRaw().trim().toLowerCase());

  blueprints = this.blueprintsService.blueprints;
  virtualBlueprints = computed(() => {
    return this.blueprints().filter((b) => !b().isHardware && b().isValid);
  });
  filteredBlueprints = computed(() => {
    if (this.filter().length === 0) return this.virtualBlueprints();
    return this.virtualBlueprints().filter((b) =>
      b().displayName.toLocaleLowerCase().includes(this.filter())
    );
  });

  private destroyed$ = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  onFilterChanged(newValue: string) {
    this.filterRaw.set(newValue);
  }

  onBlueprintSelected(blueprint: Blueprint) {
    // TODO: maybe add loading animation and/or toast notifications
    const location = this.location;
    this.agentsService
      .createVirtual(blueprint.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next() {
          console.log('success');
          location.back();
        },
        error(err) {
          console.log('error while creating virtual agent:', err);
          location.back();
        },
      });
  }
}
