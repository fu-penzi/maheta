import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreatePlaylistDialogComponent } from '@src/app/modules/shared/dialog/create-playlist-dialog/create-playlist-dialog.component';
import { EditStorageSettingsDialogComponent } from '@src/app/modules/shared/dialog/edit-storage-settings-dialog/edit-storage-settings-dialog.component';
import { MahetaDialogService } from '@src/app/services/maheta-dialog.service';
import { MusicLibraryTracksService } from '@src/app/services/music-library/music-library-tracks.service';
import { NavigationService } from '@src/app/services/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  constructor(
    private mahetaDialogService: MahetaDialogService,
    private navigation: NavigationService,
    private musicLibraryTracksService: MusicLibraryTracksService,
    private matDialogService: MatDialog
  ) {}

  public get isProcessing(): boolean {
    return this.mahetaDialogService.progressBarConfig.isShown;
  }

  public reloadDatabaseTrackData(): void {
    this.mahetaDialogService.showProgressBar();
    this.musicLibraryTracksService
      .reloadTracksLibrary()
      .then(() => this.mahetaDialogService.hideProgressBar())
      .catch(() => this.mahetaDialogService.hideProgressBar());
  }

  public dropDatabaseTrackData(): void {
    this.navigation.back();
    this.mahetaDialogService.openLoadingDialog();
    this.musicLibraryTracksService
      .dropTracksLibrary()
      .then(() => this.mahetaDialogService.closeLoadingDialog())
      .catch(() => this.mahetaDialogService.closeLoadingDialog());
  }

  public openCreatePlaylistDialog(): void {
    this.matDialogService.open(CreatePlaylistDialogComponent);
  }

  public openEditStorageSettingsDialog(): void {
    this.matDialogService.open(EditStorageSettingsDialogComponent, { width: '100%' });
  }
}
