import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { Pin } from '../models/pin';
import { MockDataService } from './mock-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { useMockData } from '../utils/config';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PinsService extends BaseService<Pin> {
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
    return this.mockData.getPins();
  }

  private getServerData() {
    return this.http.get<Pin[]>(`/api/pins`);
  }

  private getData() {
    return useMockData() ? this.getMockData() : this.getServerData();
  }

  get pins() {
    return this.readOnlyList;
  }

  disconnect(id: number) {
    return this.http.delete(`/api/pins/${id}/src`).pipe(
      tap((_) => {
        this.getWritableById(id)?.update((p) => {
          return {
            ...p,
            srcPinId: null,
          };
        });
      })
    );
  }

  connect(dstId: number, srcId: number) {
    return this.http.post(`/api/pins/${dstId}/src`, srcId).pipe(
      tap((_) => {
        this.getWritableById(dstId)?.update((p) => {
          return {
            ...p,
            srcPinId: srcId,
          };
        });
      })
    );
  }

  update(id: number, value: string) {
    const signal = this.getWritableById(id);
    this.http.post(`/api/pins/${id}/value`, value).subscribe({
      next() {
        signal?.update((p) => {
          return {
            ...p,
            value,
          };
        });
      },
      // TODO: maybe show a popup
      error(err) {
        console.log('error while updating pin value: ', err);
        signal?.update((p) => {
          return {
            ...p,
            value,
          };
        });
      },
    });
  }
}
