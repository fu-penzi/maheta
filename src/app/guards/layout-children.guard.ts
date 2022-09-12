import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';

import { DatabaseService } from '@src/app/db/database.service';
import { FileLoadingService } from '@src/app/services/file-loading.service';
import { MusicLibraryService } from '@src/app/services/music-library.service';

import { Observable } from 'rxjs';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';

@Injectable({
  providedIn: 'root',
})
export class LayoutChildrenGuard implements CanActivate {
  constructor(
    private readonly fileLoadingService: FileLoadingService,
    private musicLibraryService: MusicLibraryService,
    private databaseService: DatabaseService
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.databaseService
      .initDatabase()
      .then(() => this.databaseService.isTrackCollectionEmpty())
      .then((isEmpty: boolean) => (isEmpty ? this.databaseService.reloadDatabaseData() : {}))
      .then(() => this.musicLibraryService.initLibrary())
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
}
