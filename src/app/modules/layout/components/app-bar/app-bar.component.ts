import { Component, EventEmitter, Output } from '@angular/core';

import { SortingOrderEnum } from '@src/app/model/sorting-order.enum';
import { UrlEnum } from '@src/app/model/url.enum';
import { ThemeClassEnum, ThemeService } from '@src/app/modules/layout/services/theme.service';
import { MahetaDialogService, ProgressBarConfig } from '@src/app/services/maheta-dialog.service';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
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
  public readonly sortingOrderEnum: typeof SortingOrderEnum = SortingOrderEnum;

  constructor(
    private mahetaDialogService: MahetaDialogService,
    private optionsService: OptionsService,
    private themeService: ThemeService,
    private navigation: NavigationService,
    private musicControlService: MusicControlService
  ) {}

  public get sortingOrder(): string {
    return this.musicControlService.sortingOrder;
  }

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
    return this.mahetaDialogService.progressBarConfig;
  }

  public isRootScreen(): boolean {
    return this.navigation.isRootScreen();
  }

  public back(): void {
    this.navigation.back();
  }

  public setSortingOrder(sortingOrder: SortingOrderEnum): void {
    this.musicControlService.sortingOrder = sortingOrder;
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
