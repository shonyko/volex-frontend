import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlueprintsService } from 'src/app/services/blueprints.service';

@Component({
  selector: 'app-blueprints',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blueprints.component.html',
  styleUrl: './blueprints.component.scss',
})
export class BlueprintsComponent {
  static PATH: string = 'blueprints';

  private blueprintsService = inject(BlueprintsService);

  filterRaw = signal<string>('');
  filter = computed(() => this.filterRaw().trim().toLowerCase());

  blueprints = this.blueprintsService.blueprints;

  filteredBlueprints = computed(() => {
    if (this.filter().length === 0) return this.blueprints();
    return this.blueprints().filter((a) =>
      a().displayName.toLowerCase().includes(this.filter())
    );
  });

  onFilterChanged(newValue: string) {
    this.filterRaw.set(newValue);
  }
}
