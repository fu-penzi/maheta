import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { logger } from '@src/devUtils';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _history: string[] = [];
  constructor(private router: Router, private location: Location) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._history.push(event.urlAfterRedirects);
      }
    });
  }

  public back(): void {
    const current: string | undefined = this._history.pop();
    const prev: string | undefined = this._history[this._history.length - 1];
    if (prev === current) {
      this._history.pop();
    }
    if (this._history.length > 0) {
      this.router.navigateByUrl(this._history[this._history.length - 1]);
    } else {
      this.router.navigateByUrl('/songs');
    }
  }
}
