import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { LoadingDialogComponent } from '@src/app/modules/shared/dialog/loading-dialog/loading-dialog.component';

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
  public progressBarConfig: ProgressBarConfig = { isShown: false, progress: 0 };

  private _dialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(private matDialogService: MatDialog) {}

  public openLoadingDialog(): void {
    this._dialogRef = this.matDialogService.open(LoadingDialogComponent, dialogConf);
  }

  public closeLoadingDialog(): void {
    this._dialogRef.close();
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
