import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { LoadingDialogComponent } from '@src/app/modules/shared/dialog/loading-dialog/loading-dialog.component';
import { PlayerSheetComponent } from '@src/app/modules/shared/sheet/player-sheet/player-sheet.component';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

export interface ProgressBarConfig {
  isShown: boolean;
  progress: number;
}

const dialogConf: MatDialogConfig<LoadingDialogComponent> = {
  width: '100%',
  disableClose: true,
};

@Injectable({
  providedIn: 'root',
})
export class MahetaService {
  public playerSheetOpen: boolean = false;
  public progressBarConfig: ProgressBarConfig = {
    isShown: false,
    progress: 0,
  };

  private _dialogRef: MatDialogRef<LoadingDialogComponent>;
  private _playerSheetRef: MatBottomSheetRef<PlayerSheetComponent>;

  constructor(private matDialogService: MatDialog, private bottomSheet: MatBottomSheet) {}

  public openLoadingDialog(): void {
    this._dialogRef = this.matDialogService.open(LoadingDialogComponent, dialogConf);
  }

  public closeLoadingDialog(): void {
    this._dialogRef.close();
  }

  public openPlayerSheet(): void {
    this.playerSheetOpen = true;
    this._playerSheetRef = this.bottomSheet.open(PlayerSheetComponent);
    this._playerSheetRef.afterDismissed().subscribe(() => (this.playerSheetOpen = false));
  }

  public closePlayerSheet(): void {
    this._playerSheetRef.dismiss();
  }

  public showProgressBar(): void {
    this.progressBarConfig.isShown = true;
  }

  public hideProgressBar(): void {
    this.progressBarConfig.isShown = false;
  }

  public updateProgressBar(progress: number): void {
    this.progressBarConfig.progress = progress;
  }
}
