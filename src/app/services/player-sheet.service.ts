import { Injectable } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetContainer,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

import { PlayerSheetComponent } from '@src/app/modules/shared/sheet/player-sheet/player-sheet.component';
import { NavigationService } from '@src/app/services/navigation.service';

import { distinctUntilChanged, Subject, take } from 'rxjs';

const playerSheetConfig: MatBottomSheetConfig = {
  panelClass: 'player-sheet-panel',
  backdropClass: 'player-sheet-backdrop',
};

@Injectable({
  providedIn: 'root',
})
export class PlayerSheetService {
  private _playerSheetRef: MatBottomSheetRef<PlayerSheetComponent>;

  constructor(private bottomSheet: MatBottomSheet, private navigationService: NavigationService) {
    this.navigationService.overlayOpen$
      .pipe(distinctUntilChanged())
      .subscribe((isOpen: boolean) => !isOpen && this.close());
  }

  private get overlayOpen$(): Subject<boolean> {
    return this.navigationService.overlayOpen$;
  }

  private get containerInstance(): MatBottomSheetContainer {
    return this._playerSheetRef?.containerInstance;
  }

  public open(): void {
    this.overlayOpen$.next(true);
    if (!this._playerSheetRef) {
      this._playerSheetRef = this.bottomSheet.open(PlayerSheetComponent, playerSheetConfig);
      return;
    }
    this.containerInstance._animationState = 'visible';
    this.toggleBackdrop(true);
    this.toggleContainer(true);
    this._playerSheetRef.afterDismissed().subscribe(() => this.overlayOpen$.next(false));
  }

  public close(): void {
    if (!this.containerInstance) {
      return;
    }
    this.overlayOpen$.next(false);
    this.containerInstance._animationState = 'void';
    this.toggleBackdrop(false);
    this.containerInstance._animationStateChanged.pipe(take(2)).subscribe((event) => {
      if (event.toState === 'void' && event.phaseName === 'done') {
        this.toggleContainer(false);
      }
    });
  }

  private toggleContainer(show: boolean): void {
    document
      .querySelector(`.${playerSheetConfig.panelClass}`)
      ?.classList.toggle('hidden-overlay', !show);
  }

  private toggleBackdrop(show: boolean): void {
    const backdrop = document.querySelector(`.${playerSheetConfig.backdropClass}`);
    if (!backdrop) {
      return;
    }
    backdrop.classList.toggle('hidden-overlay', !show);
    backdrop.classList.toggle('cdk-overlay-backdrop-showing', show);
  }
}
