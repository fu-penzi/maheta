import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';

import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { NavigationService } from '@src/app/services/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class AppStateCacheService {
  constructor(
    private navigationService: NavigationService,
    private musicControlService: MusicControlService
  ) {}

  public init(): void {
    App.addListener('appStateChange', () => {
      this.navigationService.backupNavigationState();
      this.musicControlService.backupMusicControlState();
    });
  }
}
