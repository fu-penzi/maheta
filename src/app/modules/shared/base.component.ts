import { Component, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

@Component({ template: '' })
export abstract class BaseComponent implements OnDestroy {
  public onDestroy$: Subject<void> = new Subject<void>();

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}
