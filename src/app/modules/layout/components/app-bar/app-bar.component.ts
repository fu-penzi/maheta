import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { DatabaseService } from '@src/app/db/database.service';
import { UrlEnum } from '@src/app/model/url.enum';
import { ThemeClassEnum, ThemeService } from '@src/app/modules/layout/services/theme.service';
import { CreatePlaylistDialogComponent } from '@src/app/modules/shared/dialog/create-playlist-dialog/create-playlist-dialog.component';
import { EditStorageSettingsDialogComponent } from '@src/app/modules/shared/dialog/edit-storage-settings-dialog/edit-storage-settings-dialog.component';
import { LoadingDialogComponent } from '@src/app/modules/shared/dialog/loading-dialog/loading-dialog.component';
import { NavigationService } from '@src/app/services/navigation.service';

@Component({
  selector: 'maheta-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.scss'],
})
export class AppBarComponent {
  constructor(
    private themeService: ThemeService,
    private navigation: NavigationService,
    private databaseService: DatabaseService,
    private matDialogService: MatDialog
  ) {}

  public get themeClass(): ThemeClassEnum {
    return this.themeService.theme;
  }

  public back(): void {
    this.navigation.back();
  }

  public reloadDatabaseTrackData(): void {
    const dialogConf: MatDialogConfig<LoadingDialogComponent> = {
      width: '100%',
      disableClose: true,
    };
    const dialogRef: MatDialogRef<LoadingDialogComponent> = this.matDialogService.open(
      LoadingDialogComponent,
      dialogConf
    );

    this.databaseService
      .reloadTracksCollection()
      .then(() => dialogRef.close())
      .catch(() => dialogRef.close());
  }

  public openCreatePlaylistDialog(): void {
    this.matDialogService.open(CreatePlaylistDialogComponent);
  }

  public openEditStorageSettingsDialog(): void {
    this.matDialogService.open(EditStorageSettingsDialogComponent, { width: '100%' });
  }

  public switchTheme(): void {
    this.themeService.switchTheme();
  }

  public isCurrentTabPlaylists(): boolean {
    return this.navigation.bottomNavTabUrl === UrlEnum.PLAYLISTS;
  }
}
