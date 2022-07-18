import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';

import { FileLoadingService } from '@src/app/services/file-loading.service';
import { MusicLibraryService } from '@src/app/services/music-library.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutChildrenGuard implements CanActivate {
  constructor(
    private readonly fileLoadingService: FileLoadingService,
    private musicLibraryService: MusicLibraryService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.fileLoadingService
      .loadMusic()
      .then((tracks) => {
        this.musicLibraryService.tracks = tracks;
      })
      .then(() => true)
      .catch((err) => {
        console.error(err);
        return false;
      });
  }
}
