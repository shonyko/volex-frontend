import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { Param } from '../models/param';
import { MockDataService } from './mock-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ParamsService extends BaseService<Param> {
  private mockData = inject(MockDataService);

  public loaded = signal(false);

  constructor() {
    super();

    this.mockData
      .getParams()
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
