import { Component } from '@angular/core';

import { AppStateCacheService } from '@src/app/services/app-state-cache.service';
import { LocalizationService } from '@src/app/services/localization.service';

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
