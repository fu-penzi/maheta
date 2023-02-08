import { Injectable, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { App } from '@capacitor/app';

import { UrlEnum } from '@src/app/model/url.enum';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  public bottomNavTabUrl: UrlEnum = UrlEnum.ALBUMS;

  public overlayOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private _history: string[] = [];

  constructor(private router: Router, private zone: NgZone) {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      this._history.push(event.urlAfterRedirects);
      Object.values(UrlEnum).forEach((url: UrlEnum) => {
        if (this._history[this._history.length - 1].includes(url)) {
          this.bottomNavTabUrl = url;
        }
      });
    });

    App.addListener('backButton', () => this.zone.run(() => this.back()));
  }

  private get overlayOpen(): boolean {
    return this.overlayOpen$.value;
  }

  public back(): void {
    if (this.overlayOpen) {
      this.overlayOpen$.next(false);
      return;
    }

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

  public isRootScreen(): boolean {
    return (
      this.router.url.split('/').length === 2 &&
      !Object.keys(this.router.parseUrl(this.router.url).queryParams).length
    );
  }
}
