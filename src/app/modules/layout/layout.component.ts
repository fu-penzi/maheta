import { Component } from '@angular/core';

import { ThemeService } from '@app/modules/layout/services/theme.service';

@Component({
  selector: 'maheta-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  constructor(private themeService: ThemeService) {}

  public switchTheme(): void {
    this.themeService.switchTheme();
  }

  public get theme(): string {
    return this.themeService.theme;
  }
}
