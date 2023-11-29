import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PairRequestsService } from 'src/app/services/pair-requests.service';
import { BlueprintsService } from 'src/app/services/blueprints.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss',
})
export class RequestsComponent {
  static PATH: string = 'requests';

  private requestsService = inject(PairRequestsService);
  blueprintsService = inject(BlueprintsService);

  requests = this.requestsService.pairRequests;
}
