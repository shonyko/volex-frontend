import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agent } from '../models/agent';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MockDataService } from './mock-data.service';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root',
})
export class AgentsService extends BaseService<Agent> {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);

  public loaded = signal(false);

  constructor() {
    super();
    // this.http
    //   .get<AgentDto[]>('test')
    //   .pipe(takeUntilDestroyed())
    //   .subscribe((agents) => {});
    // effect(
    //   () => {
    //     if (!this.blueprintService.loaded()) {
    //       return;
    //     }
    this.mockData
      .getAgents()
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        for (let item of data) {
          this.updateItem(item);
        }
        this.loaded.set(true);
      });
    //   },
    //   {
    //     allowSignalWrites: true,
    //   }
    // );
  }

  get agents() {
    // if (!this.loaded) {
    //   this.http.get('');
    // }
    return this.readOnlyList;
  }
}
