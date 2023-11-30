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

  get params() {
    return this.readOnlyList;
  }
}
