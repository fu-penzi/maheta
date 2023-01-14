import { Component } from '@angular/core';

import { LocalizationService } from '@src/app/services/localization.service';

@Component({
  selector: 'maheta-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Maheta';
  constructor(private localizationService: LocalizationService) {
    this.localizationService.init();
  }
}
