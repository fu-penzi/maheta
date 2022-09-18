import { Injectable } from '@angular/core';

import { random } from 'lodash';
import { Subject } from 'rxjs';

export enum RepeatModeEnum {
  none,
  repeatQueue,
  repeatOne,
}
@Injectable()
export class QueueService<T> {
  public currentItem$: Subject<T> = new Subject<T>();
  public repeatMode: RepeatModeEnum = RepeatModeEnum.none;
  public shuffle: boolean = false;

  private _cursor: number;
  private _queue: T[] = [];

  public get isRepeatOne(): boolean {
    return this.repeatMode === RepeatModeEnum.repeatOne;
  }

  public get isRepeatQueue(): boolean {
    return this.repeatMode === RepeatModeEnum.repeatQueue;
  }

  public get currentItem(): T {
    if (this._cursor >= this._queue.length) {
      console.error('Incorrect queue index');
      this._cursor = 0;
    }

    return this._queue[this._cursor];
  }

  public moveToNext(): void {
    if (this.isRepeatOne) {
      this.currentItem$.next(this.currentItem);
      return;
    }
    if (this.shuffle) {
      const randomItem = random(this._queue.length);
      this._cursor = this._cursor === randomItem ? random(this._queue.length - 1) : randomItem;
      this.currentItem$.next(this.currentItem);
      return;
    }
    if (this.isRepeatQueue && this.isEnd()) {
      this._cursor = 0;
      this.currentItem$.next(this.currentItem);
      return;
    }
    if (!this.isEnd()) {
      this._cursor += 1;
    }
    this.currentItem$.next(this.currentItem);
  }

  public moveToPrev(): void {
    if (this.isRepeatOne) {
      this.currentItem$.next(this.currentItem);
      return;
    }
    if (this.shuffle) {
      const randomItem = random(this._queue.length);
      this._cursor = this._cursor === randomItem ? random(this._queue.length) : randomItem;
      return;
    }
    if (this.isRepeatQueue && this.isStart()) {
      this._cursor = this._queue.length - 1;
      this.currentItem$.next(this.currentItem);
      return;
    }
    if (!this.isStart()) {
      this._cursor -= 1;
    }
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

  public isStart(): boolean {
    return this._cursor === 0;
  }

  public isEnd(): boolean {
    return this._cursor === this._queue.length - 1;
  }
}
