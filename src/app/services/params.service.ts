import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { Param } from '../models/param';
import { MockDataService } from './mock-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { useMockData } from '../utils/config';
import { WebsocketService } from './websocket.service';
import { Events } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class ParamsService extends BaseService<Param> {
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
    this.websocket.on(Events.PARAM_VALUE, ({ id, value }) => {
      // const change = JSON.parse(args) as { id: number; value: string };
      const param = this.getWritableById(Number(id));
      if (param == null) {
        return;
      }
      param.update((p) => ({
        ...p,
        value: value,
      }));
    });
    this.websocket.on(Events.NEW_PARAM, (p: Param) => {
      this.updateItem(p);
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
