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
      l.push(sig as WritableSignal<T>);
      return l;
    });
  }

  updateItem(item: T) {
    let s = this.itemMap.get(item.id);
    if (s == null) {
      s = signal(item);
      this.addToList(s as WritableSignal<T>);
    } else if (s() == null) {
      s.set(item);
      this.addToList(s as WritableSignal<T>);
    }
    this.itemMap.set(item.id, s);
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
}
