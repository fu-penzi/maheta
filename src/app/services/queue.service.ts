import { Injectable } from '@angular/core';

@Injectable()
export class QueueService<T> {
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
  }

  public moveTo(index: number): void {
    if (index >= this._queue.length) {
      console.error('Incorrect queue index');
      return;
    }

    this._cursor = index;
  }

  public add(items: T[]): void {
    this._queue.push(...items);
  }

  public clear(): void {
    this._cursor = 0;
    this._queue.length = 0;
  }
}
