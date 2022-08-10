import { Injectable, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { App } from '@capacitor/app';

import { UrlEnum } from '@src/app/model/url.enum';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  //TODO remove history, back to parent route ".."
  private _history: string[] = [];
  constructor(private router: Router, private zone: NgZone) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._history.push(event.urlAfterRedirects);
      }
    });

    App.addListener('backButton', () => {
      this.zone.run(() => {
        this.back();
      });
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
      this.router.navigateByUrl(UrlEnum.ALBUMS);
    }
  }
}
