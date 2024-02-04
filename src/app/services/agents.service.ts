import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agent } from '../models/agent';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MockDataService } from './mock-data.service';
import { BaseService } from './base-service';
import { useMockData } from '../utils/config';
import { WebsocketService } from './websocket.service';
import { Events } from '../utils/constants';
import { tap } from 'rxjs';
import { ParamsService } from './params.service';
import { PinsService } from './pins.service';

@Injectable({
  providedIn: 'root',
})
export class AgentsService extends BaseService<Agent> {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);
  private websocket = inject(WebsocketService);
  private paramsService = inject(ParamsService);
  private pinsService = inject(PinsService);

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
    this.websocket.on(Events.NEW_AGENT, (a: Agent) => {
      this.updateItem(a);
    });
  }

  private getMockData() {
    return this.mockData.getAgents();
  }

  private getServerData() {
    return this.http.get<Agent[]>(`/api/agents`);
  }

  private getData() {
    return useMockData() ? this.getMockData() : this.getServerData();
  }

  get agents() {
    return this.readOnlyList;
  }

  createVirtual(blueprintId: number) {
    return this.http
      .post<Agent>(`/api/agents/add-virtual?blueprintId=${blueprintId}`, null)
      .pipe(
        tap((a: Agent) => {
          this.updateItem(a);
        })
      );
  }

  unlink(id: number) {
    return this.http.delete(`/api/agents/${id}`).pipe(
      tap((_) => {
        this.paramsService.removeFromAgent(id);
        this.pinsService.removeFromAgent(id);
        this.itemList.update((l) => l.filter((a) => a().id != id));
        this.itemMap.delete(id);
      })
    );
  }
}
