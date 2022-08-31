import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable()
export class QueueService<T> {
  public currentItem$: Subject<T> = new Subject<T>();

  private _cursor: number;
  private _queue: T[] = [];

  public get currentItem(): T {
    if (this._cursor >= this._queue.length) {
      console.error('Incorrect queue index');
    }

    return this._queue[this._cursor];
  }

  public moveBy(gap: number): void {
    this._cursor = (this._cursor + gap) % this._queue.length;
    this.currentItem$.next(this.currentItem);
  }

  public moveTo(index: number): void {
    if (index >= this._queue.length) {
      return;
    }

    this._cursor = index;
    this.currentItem$.next(this.currentItem);
  }

  public add(items: T[]): void {
    this._queue.push(...items);
  }

  public clear(): void {
    this._cursor = 0;
    this._queue.length = 0;
  }
}
