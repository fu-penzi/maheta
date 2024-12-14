import { Component } from '@angular/core';
import { AnimationDurations } from '@angular/material/core';

import { AppStateCacheService } from '@src/app/services/app-state-cache.service';
import { LocalizationService } from '@src/app/services/localization.service';

/* Override mat-bottom-sheet slow close animation */
AnimationDurations.COMPLEX = AnimationDurations.EXITING;

@Component({
  selector: 'maheta-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Maheta';
  constructor(
    private localizationService: LocalizationService,
    private appStateCacheService: AppStateCacheService
  ) {
    this.localizationService.init();
    this.appStateCacheService.init();
  }
}
