import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { PairRequest } from '../models/pair-request';
import { MockDataService } from './mock-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseService } from './base-service';
import { useMockData } from '../utils/config';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PairRequestsService extends BaseService<PairRequest> {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);

  public loaded = signal(false);

  constructor() {
    super();
    this.getData()
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        for (let item of data) {
          this.updateItem(item);
        }
        this.loaded.set(true);
      });
  }

  private getMockData() {
    return this.mockData.getRequests();
  }

  private getServerData() {
    return this.http.get<PairRequest[]>(`/api/requests`);
  }

  private getData() {
    return useMockData() ? this.getMockData() : this.getServerData();
  }

  get pairRequests() {
    return this.readOnlyList;
  }

  allow(id: number) {
    return this.http.post(`/api/requests/${id}/accept`, null).pipe(
      tap(() => {
        // TODO: maybe remove this after adding websockets
        this.itemMap.delete(id);
        this.itemList.update((l) => l.filter((x) => x().id != id));
      })
    );
  }
}
