import { Component, EventEmitter, Output } from '@angular/core';

import { UrlEnum } from '@src/app/model/url.enum';
import { ThemeClassEnum, ThemeService } from '@src/app/modules/layout/services/theme.service';
import { MahetaService, ProgressBarConfig } from '@src/app/services/maheta.service';
import { NavigationService } from '@src/app/services/navigation.service';
import { OptionsService } from '@src/app/services/options.service';

@Component({
  selector: 'maheta-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.scss'],
})
export class AppBarComponent {
  @Output() showSidenav: EventEmitter<void> = new EventEmitter<void>();

  public readonly urlEnum: typeof UrlEnum = UrlEnum;

  constructor(
    private mahetaService: MahetaService,
    private optionsService: OptionsService,
    private themeService: ThemeService,
    private navigation: NavigationService
  ) {}

  public get currentName(): string {
    return this.navigation.currentTabName;
  }

  public get isProcessing(): boolean {
    return this.optionsService.isProcessing;
  }

  public get themeClass(): ThemeClassEnum {
    return this.themeService.theme;
  }

  public get progressBarConfig(): ProgressBarConfig {
    return this.mahetaService.progressBarConfig;
  }

  public isRootScreen(): boolean {
    return this.navigation.isRootScreen();
  }

  public back(): void {
    this.navigation.back();
  }

  public reloadDatabaseTrackData(): void {
    this.optionsService.reloadDatabaseTrackData();
  }

  public openCreatePlaylistDialog(): void {
    this.optionsService.openCreatePlaylistDialog();
  }

  public switchTheme(): void {
    this.themeService.switchTheme();
  }

  public isCurrentTabPlaylists(): boolean {
    return this.navigation.bottomNavTabUrl === UrlEnum.PLAYLISTS;
  }
}
