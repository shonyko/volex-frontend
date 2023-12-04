import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { Param } from '../models/param';
import { MockDataService } from './mock-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { useMockData } from '../utils/config';

@Injectable({
  providedIn: 'root',
})
export class ParamsService extends BaseService<Param> {
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
    return this.mockData.getParams();
  }

  private getServerData() {
    return this.http.get<Param[]>(`/api/params`);
  }

  private getData() {
    return useMockData() ? this.getMockData() : this.getServerData();
  }

  update(id: number, value: string) {
    var signal = this.getWritableById(id);
    this.http.post(`/api/params/${id}/value`, value).subscribe({
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
        console.log('error while updating param value: ', err);
        signal?.update((p) => {
          return {
            ...p,
          };
        });
      },
    });
  }

  get params() {
    return this.readOnlyList;
  }
}
