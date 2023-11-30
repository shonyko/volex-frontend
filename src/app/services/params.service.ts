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

    // simulate websocket update
    // setTimeout(() => {
    //   this.itemList()[0].update((p) => {
    //     console.log(p);
    //     p.value = 'false';
    //     return p;
    //   });
    // }, 5000);
  }

  update(id: number, value: string) {
    //TODO: send it to the backend
    console.log(value);
    var signal = this.getWritableById(id);
    if (signal != null) {
      signal.update((p) => {
        p.value = value;
        return p;
      });
    }
  }

  get params() {
    return this.readOnlyList;
  }
}
