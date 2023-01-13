import { Component, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';

@Component({ template: '' })
export abstract class BaseComponent implements OnDestroy {
  private _onDestroy$: Subject<void> = new Subject<void>();

  public get onDestroy$(): Observable<void> {
    return this._onDestroy$.asObservable();
  }

  public ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }
}
