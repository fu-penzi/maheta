import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { CreatePlaylistDialogComponent } from '@src/app/modules/shared/dialog/create-playlist-dialog/create-playlist-dialog.component';
import {
  EditLyricsDialogComponent,
  EditLyricsDialogData,
} from '@src/app/modules/shared/dialog/edit-lyrics-dialog/edit-lyrics-dialog.component';
import { LoadingDialogComponent } from '@src/app/modules/shared/dialog/loading-dialog/loading-dialog.component';

export interface ProgressBarConfig {
  isShown: boolean;
  progress: number;
  mode: 'determinate' | 'query' | 'buffer';
}

const dialogConf: MatDialogConfig<LoadingDialogComponent> = {
  width: '100%',
  disableClose: true,
};

@Injectable({
  providedIn: 'root',
})
export class MahetaService {
  public progressBarConfig: ProgressBarConfig = {
    isShown: false,
    progress: 0,
    mode: 'buffer',
  };

  private _dialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(private matDialogService: MatDialog) {}

  public openLoadingDialog(): void {
    this._dialogRef = this.matDialogService.open(LoadingDialogComponent, dialogConf);
  }

  public closeLoadingDialog(): void {
    this._dialogRef.close();
  }

  public showProgressBar(): void {
    this.progressBarConfig.mode = 'query';
    this.progressBarConfig.isShown = true;
  }

  public hideProgressBar(): void {
    this.progressBarConfig.mode = 'determinate';
    this.progressBarConfig.progress = 100;
    this.progressBarConfig.isShown = false;
  }

  public updateProgressBar(progress: number): void {
    if (progress > 0) {
      this.progressBarConfig.mode = 'determinate';
    }
    this.progressBarConfig.progress = progress;
  }

  public openEditLyricsDialog(data: EditLyricsDialogData): void {
    this.matDialogService.open(EditLyricsDialogComponent, {
      data,
      width: '100%',
      position: { top: '10%' },
    });
  }

  public openCreatePlaylistDialog(): void {
    this.matDialogService.open(CreatePlaylistDialogComponent, { position: { top: '10%' } });
  }
}
