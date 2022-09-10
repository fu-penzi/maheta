import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CanActivate, UrlTree } from '@angular/router';

import { DatabaseService } from '@src/app/db/database.service';
import { LoadingDialogComponent } from '@src/app/modules/shared/dialog/loading-dialog/loading-dialog.component';
import { FileLoadingService } from '@src/app/services/file-loading.service';
import { MusicLibraryService } from '@src/app/services/music-library.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutChildrenGuard implements CanActivate {
  private _loadingDialogRef: MatDialogRef<LoadingDialogComponent>;
  private _loadingDialogConf: MatDialogConfig<LoadingDialogComponent> = {
    width: '100%',
    disableClose: true,
  };

  constructor(
    private readonly fileLoadingService: FileLoadingService,
    private musicLibraryService: MusicLibraryService,
    private databaseService: DatabaseService,
    private matDialogService: MatDialog
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.databaseService
      .initDatabase()
      .then(() => this.databaseService.isTrackCollectionEmpty())
      .then((isEmpty: boolean) => {
        if (isEmpty) {
          this._loadingDialogRef = this.matDialogService.open(
            LoadingDialogComponent,
            this._loadingDialogConf
          );
          return this.databaseService.reloadDatabaseData();
        }
        return;
      })
      .then(() => this.musicLibraryService.initLibrary())
      .then(() => {
        this._loadingDialogRef?.close();
        return true;
      })
      .catch(() => {
        this._loadingDialogRef?.close();
        return false;
      });
  }
}
