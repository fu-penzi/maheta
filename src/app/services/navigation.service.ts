import { Injectable, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { App } from '@capacitor/app';

import { UrlEnum } from '@src/app/model/url.enum';
import { MahetaService } from '@src/app/services/maheta.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  //TODO remove history, back to parent route ".."
  public bottomNavTabUrl: UrlEnum = UrlEnum.ALBUMS;

  private _history: string[] = [];
  constructor(private router: Router, private zone: NgZone, private mahetaService: MahetaService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._history.push(event.urlAfterRedirects);

        Object.values(UrlEnum).forEach((url: UrlEnum) => {
          if (this._history[this._history.length - 1].includes(url)) {
            this.bottomNavTabUrl = url;
          }
        });
      }
    });

    App.addListener('backButton', () => {
      this.zone.run(() => {
        if (this.mahetaService.playerSheetOpen) {
          this.mahetaService.closePlayerSheet();
          return;
        }
        this.back();
      });
    });
  }

  public back(): void {
    if (this.mahetaService.playerSheetOpen) {
      this.mahetaService.closePlayerSheet();
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
    return this.router.url.split('/').length === 2;
  }
}
