import { Injectable, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { App } from '@capacitor/app';

import { LocalStorageEnum } from '@src/app/model/localStorage.enum';
import { UrlEnum } from '@src/app/model/url.enum';

import { BehaviorSubject } from 'rxjs';

interface NavigationState {
  history: string[];
}

export const ROOT_SCREEN_URLS: UrlEnum[] = [UrlEnum.ALBUMS, UrlEnum.PLAYLISTS, UrlEnum.SONGS];

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  public bottomNavTabUrl: UrlEnum = UrlEnum.ALBUMS;
  public overlayOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private _history: string[] = [];
  private _currentTabName: string = UrlEnum.ALBUMS;

  constructor(private router: Router, private zone: NgZone) {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      if (this._history[this._history.length - 1] !== event.urlAfterRedirects) {
        this._history.push(event.urlAfterRedirects);
      }

      Object.values(UrlEnum).forEach((url: UrlEnum) => {
        if (this._history[this._history.length - 1].includes(url)) {
          this.bottomNavTabUrl = url;
          this.currentTabName = String(url[0]).toUpperCase() + String(url).slice(1);
        }
      });
    });

    App.addListener('backButton', () => this.zone.run(() => this.back()));
  }

  public get currentTabName(): string {
    return this._currentTabName;
  }

  public set currentTabName(tabName: string) {
    this._currentTabName = tabName || this._currentTabName;
  }

  private get overlayOpen(): boolean {
    return this.overlayOpen$.value;
  }

  public backupNavigationState(): void {
    const navigationState: NavigationState = { history: this._history };
    localStorage.setItem(LocalStorageEnum.navigationState, JSON.stringify(navigationState));
  }

  public restoreRouterHistory(): Promise<boolean> {
    const backupHistory: string | null = localStorage.getItem(LocalStorageEnum.navigationState);
    if (!backupHistory) {
      return Promise.resolve(true);
    }
    const navigationState: NavigationState = JSON.parse(backupHistory);
    if (!navigationState?.history || navigationState.history.length === 0) {
      return Promise.resolve(true);
    }

    return this.router.navigateByUrl(
      `/${navigationState.history[navigationState.history.length - 1]}`
    );
  }

  public back(): void {
    if (this.overlayOpen) {
      this.overlayOpen$.next(false);
      return;
    }

    if (this.isRootScreen()) {
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
      ROOT_SCREEN_URLS.some((url: string) => this.router.url.startsWith('/' + url)) &&
      this.router.url.split('/').length === 2 &&
      !Object.keys(this.router.parseUrl(this.router.url).queryParams).length
    );
  }
}
