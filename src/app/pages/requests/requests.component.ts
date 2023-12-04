import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PairRequestsService } from 'src/app/services/pair-requests.service';
import { BlueprintsService } from 'src/app/services/blueprints.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss',
})
export class RequestsComponent implements OnDestroy {
  static PATH: string = 'requests';

  private requestsService = inject(PairRequestsService);
  blueprintsService = inject(BlueprintsService);

  requests = this.requestsService.pairRequests;

  private destroyed$ = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  allow(id: number) {
    // TODO: maybe add loading animation
    this.requestsService
      .allow(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next() {
          console.log('success');
        },
        error(err) {
          console.log('error while allowing request ', err);
        },
      });
  }
}
