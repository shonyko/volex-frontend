import { Component, HostBinding, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss',
})
export class AgentComponent {
  @HostBinding('class') controlClass = '';

  private location = inject(Location);

  private back() {
    this.location.back();
  }

  onBack() {
    this.controlClass = 'inactive';
    setTimeout(this.back.bind(this), 215);
  }
}
