import { Injectable } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { LoadingDialogComponent } from '@src/app/modules/shared/dialog/loading-dialog/loading-dialog.component';
import { PlayerSheetComponent } from '@src/app/modules/shared/sheet/player-sheet/player-sheet.component';

import { Observable, Subject } from 'rxjs';

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
  private _playerSheetOpen$: Subject<boolean> = new Subject<boolean>();

  constructor(private matDialogService: MatDialog, private bottomSheet: MatBottomSheet) {}

  public get playerSheetOpen$(): Observable<boolean> {
    return this._playerSheetOpen$.asObservable();
  }

  public openLoadingDialog(): void {
    this._dialogRef = this.matDialogService.open(LoadingDialogComponent, dialogConf);
  }

  public closeLoadingDialog(): void {
    this._dialogRef.close();
  }

  public openPlayerSheet(): void {
    this.playerSheetOpen = true;
    this._playerSheetOpen$.next(true);
    this._playerSheetRef = this.bottomSheet.open(PlayerSheetComponent);
    this._playerSheetRef.afterDismissed().subscribe(() => {
      this.playerSheetOpen = false;
      this._playerSheetOpen$.next(false);
    });
  }

  public closePlayerSheet(): void {
    this._playerSheetRef.dismiss();
    this._playerSheetOpen$.next(false);
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
