import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PairRequest } from 'src/app/models/pair-request';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss',
})
export class RequestsComponent {
  static PATH: string = 'requests';

  requests = signal<PairRequest[]>([
    {
      id: 1,
      blueprint: {
        id: 1,
        displayName: 'LED',
      },
      macAddr: 'xx:xx:xx:xx:xx:xx',
      date: Date.now().toLocaleString(),
    },
    {
      id: 2,
      blueprint: {
        id: 2,
        displayName: 'SWITCH',
      },
      macAddr: 'yy:yy:yy:yy:yy:yy',
      date: Date.now().toLocaleString(),
    },
  ]);
}
