import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { Pin } from '../models/pin';
import { MockDataService } from './mock-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class PinsService extends BaseService<Pin> {
  private mockData = inject(MockDataService);

  public loaded = signal(false);

  constructor() {
    super();

    this.mockData
      .getPins()
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        for (let item of data) {
          this.updateItem(item);
        }
        this.loaded.set(true);
      });
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
