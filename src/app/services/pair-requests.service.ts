import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { PairRequest } from '../models/pair-request';
import { MockDataService } from './mock-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseService } from './base-service';
import { useMockData } from '../utils/config';
import { tap } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { Events } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class PairRequestsService extends BaseService<PairRequest> {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);
  private websocket = inject(WebsocketService);

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
    this.websocket.on(Events.NEW_PAIR_REQUEST, (pr: PairRequest) => {
      // const pr = JSON.parse(args) as PairRequest;
      this.updateItem(pr);
    });
    this.websocket.on(Events.DEL_PAIR_REQUEST, (id: number) => {
      // const id = args as number;
      this.itemList.update((l) => l.filter((pr) => pr().id != id));
      this.itemMap.delete(id);
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
