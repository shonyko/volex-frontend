import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Blueprint } from '../models/blueprint';
import { MockDataService } from './mock-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root',
})
export class BlueprintsService extends BaseService<Blueprint> {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);

  public loaded = signal(false);

  constructor() {
    super();
    // this.http
    //   .get<AgentDto[]>('test')
    //   .pipe(takeUntilDestroyed())
    //   .subscribe((agents) => {});
    this.mockData
      .getBlueprints()
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        for (let item of data) {
          this.updateItem(item);
        }
        this.loaded.set(true);
      });
  }

  get blueprints() {
    // if (!this.loaded) {
    //   this.http.get('');
    // }
    return this.readOnlyList;
  }
}
