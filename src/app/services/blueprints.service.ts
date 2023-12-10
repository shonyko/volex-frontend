import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Blueprint } from '../models/blueprint';
import { MockDataService } from './mock-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseService } from './base-service';
import { useMockData } from '../utils/config';
import { Events } from '../utils/constants';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class BlueprintsService extends BaseService<Blueprint> {
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
    this.websocket.on(Events.NEW_BLUEPRINT, (b: Blueprint) => {
      this.updateItem(b);
    });
    this.websocket.on(Events.DEL_BLUEPRINT, (id: number) => {
      this.itemList.update((l) => l.filter((pr) => pr().id != id));
      this.itemMap.delete(id);
    });
  }

  private getMockData() {
    return this.mockData.getBlueprints();
  }

  private getServerData() {
    return this.http.get<Blueprint[]>(`/api/blueprints`);
  }

  private getData() {
    return useMockData() ? this.getMockData() : this.getServerData();
  }

  get blueprints() {
    return this.readOnlyList;
  }

  delete(id: number) {
    return this.http.delete(`/api/blueprints/${id}`).subscribe({
      next() {
        console.log('deleted');
      },
      error(err) {
        console.log('error while deleting blueprint: ', err);
      },
    });
  }
}
