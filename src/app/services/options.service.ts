import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreatePlaylistDialogComponent } from '@src/app/modules/shared/dialog/create-playlist-dialog/create-playlist-dialog.component';
import { EditStorageSettingsDialogComponent } from '@src/app/modules/shared/dialog/edit-storage-settings-dialog/edit-storage-settings-dialog.component';
import { MahetaService } from '@src/app/services/maheta.service';
import { MusicLibraryTracksService } from '@src/app/services/music-library/music-library-tracks.service';
import { NavigationService } from '@src/app/services/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  constructor(
    private mahetaService: MahetaService,
    private navigation: NavigationService,
    private musicLibraryTracksService: MusicLibraryTracksService,
    private matDialogService: MatDialog
  ) {}

  public get isProcessing(): boolean {
    return this.mahetaService.progressBarConfig.isShown;
  }

  public reloadDatabaseTrackData(): void {
    this.mahetaService.showProgressBar();
    this.musicLibraryTracksService
      .reloadTracksLibrary()
      .then(() => this.mahetaService.hideProgressBar())
      .catch(() => this.mahetaService.hideProgressBar());
  }

  public dropDatabaseTrackData(): void {
    this.navigation.back();
    this.mahetaService.openLoadingDialog();
    this.musicLibraryTracksService
      .dropTracksLibrary()
      .then(() => this.mahetaService.closeLoadingDialog())
      .catch(() => this.mahetaService.closeLoadingDialog());
  }

  public openCreatePlaylistDialog(): void {
    this.matDialogService.open(CreatePlaylistDialogComponent);
  }

  public openEditStorageSettingsDialog(): void {
    this.matDialogService.open(EditStorageSettingsDialogComponent, { width: '100%' });
  }
}
