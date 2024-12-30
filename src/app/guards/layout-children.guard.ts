import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';

import { DatabaseService } from '@src/app/db/database.service';
import { MahetaDialogService } from '@src/app/services/maheta-dialog.service';
import { MusicLibraryService } from '@src/app/services/music-library/music-library.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutChildrenGuard implements CanActivate {
  constructor(
    private musicLibraryService: MusicLibraryService,
    private databaseService: DatabaseService,
    private mahetaDialogService: MahetaDialogService
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.mahetaDialogService.openLoadingDialog();
    return this.databaseService
      .initDatabase()
      .then(() => this.musicLibraryService.initLibrary())
      .then(() => true);
  }
}
