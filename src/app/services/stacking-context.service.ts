import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { Album, getDefaultAlbum } from '@src/app/db/domain/album';
import { UrlEnum } from '@src/app/model/url.enum';
import { UrlParamsEnum } from '@src/app/model/url-params.enum';
import { MusicLibraryAlbumsService } from '@src/app/services/music-library/music-library-albums.service';

import { BehaviorSubject, filter, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StackingContextService {
  public currentAlbum$: BehaviorSubject<Album> = new BehaviorSubject<Album>({
    ...getDefaultAlbum(),
    thumbUrl: '',
    title: '',
    author: '',
  } as unknown as Album);
  public showStackingContext: boolean = false;

  constructor(
    private musicLibraryAlbumsService: MusicLibraryAlbumsService,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        if (!(event instanceof NavigationStart)) {
          return;
        }
        if (this.router.url.includes(UrlEnum.ALBUMS)) {
          const albumTitle = this.getQueryParam(event.url, UrlParamsEnum.albumTitle);
          this.setAlbumVisibility(albumTitle);
        }
      });
  }

  private setAlbumVisibility(albumTitle: string | null): void {
    this.showStackingContext = !!albumTitle;
    if (albumTitle) {
      this.musicLibraryAlbumsService
        .getAlbum(albumTitle)
        .pipe(take(1))
        .subscribe((album) => this.currentAlbum$.next(album || getDefaultAlbum()));
    }
  }

  private getQueryParam(url: string, paramName: UrlParamsEnum): string | null {
    return this.router.parseUrl(url).queryParamMap.get(paramName);
  }
}
