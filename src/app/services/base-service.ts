import { Signal, WritableSignal, computed, signal } from '@angular/core';
import { HasId } from '../models/has-id';

export class BaseService<T extends HasId> {
  protected itemList = signal<WritableSignal<T>[]>([]);
  protected itemMap: Map<number, WritableSignal<T | null>> = new Map();
  protected readOnlyList = computed(() =>
    this.itemList().map((s) => s.asReadonly())
  );

  private addToList(sig: WritableSignal<T>) {
    this.itemList.update((l) => {
      return [...l, sig];
    });
  }

  protected updateItem(item: T) {
    let s = this.itemMap.get(item.id);
    if (s == null) {
      s = signal(null);
      this.itemMap.set(item.id, s);
    }

    const old_val = s();
    s.set(item);

    if (old_val == null) {
      this.addToList(s as WritableSignal<T>);
    }
  }

  getById(id: number): Signal<T | null> {
    if (this.itemMap.has(id)) {
      return this.itemMap.get(id)!;
    }
    // TODO: maybe try and fetch it (?)
    const s = signal(null);
    this.itemMap.set(id, s);
    return s;
  }

  protected getWritableById(id: number): WritableSignal<T> | null {
    if (this.itemMap.has(id)) {
      return this.itemMap.get(id)! as WritableSignal<T>;
    }

    return null;
  }
}
