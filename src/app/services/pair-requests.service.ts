import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { PairRequest } from '../models/pair-request';
import { MockDataService } from './mock-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root',
})
export class PairRequestsService extends BaseService<PairRequest> {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);

  public loaded = signal(false);

  constructor() {
    super();
    // this.http
    //   .get<AgentDto[]>('test')
    //   .pipe(takeUntilDestroyed())
    //   .subscribe((agents) => {});
    // effect(
    //   () => {
    //     if (!this.blueprintService.loaded()) {
    //       return;
    //     }
    this.mockData
      .getRequests()
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        for (let item of data) {
          this.updateItem(item);
        }
        this.loaded.set(true);
      });
    //   },
    //   {
    //     allowSignalWrites: true,
    //   }
    // );
  }

  get pairRequests() {
    // if (!this.loaded) {
    //   this.http.get('');
    // }
    return this.readOnlyList;
  }
}
