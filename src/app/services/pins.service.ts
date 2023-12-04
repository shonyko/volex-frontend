import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { Pin } from '../models/pin';
import { MockDataService } from './mock-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { useMockData } from '../utils/config';
import { HttpClient } from '@angular/common/http';

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
    // TODO: send to backend
    this.getWritableById(id)?.update((p) => {
      return {
        ...p,
        srcPinId: null,
      };
    });
  }

  connect(dstId: number, srcId: number) {
    this.getWritableById(dstId)?.update((p) => {
      return {
        ...p,
        srcPinId: srcId,
      };
    });
  }

  update(id: number, value: string) {
    //TODO: send it to the backend
    console.log(value);
    this.getWritableById(id)?.update((p) => {
      return {
        ...p,
        value,
      };
    });
  }
}
