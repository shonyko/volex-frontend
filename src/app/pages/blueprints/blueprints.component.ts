import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Blueprint } from 'src/app/models/blueprint';

@Component({
  selector: 'app-blueprints',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blueprints.component.html',
  styleUrl: './blueprints.component.scss',
})
export class BlueprintsComponent {
  static PATH: string = 'blueprints';

  filterRaw = signal<string>('');
  filter = computed(() => this.filterRaw().trim().toLowerCase());

  blueprints = signal<Blueprint[]>([
    {
      id: 1,
      displayName: 'LED',
      isHardware: true,
      isValid: true,
    },
    {
      id: 2,
      displayName: 'SWITCH',
      isHardware: true,
      isValid: true,
    },
    {
      id: 3,
      displayName: 'TIMER',
      isHardware: false,
      isValid: false,
    },
    {
      id: 4,
      displayName: 'Multiplexer',
      isHardware: false,
      isValid: true,
    },
  ]);

  filteredBlueprints = computed(() => {
    if (this.filter().length === 0) return this.blueprints();
    return this.blueprints().filter((a) =>
      a.displayName.toLowerCase().includes(this.filter())
    );
  });

  onFilterChanged(newValue: string) {
    this.filterRaw.set(newValue);
  }
}
