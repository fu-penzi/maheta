import { Component } from '@angular/core';

import { DatabaseService } from '@src/app/db/database.service';
import { UrlEnum } from '@src/app/model/url.enum';
import { ThemeClassEnum, ThemeService } from '@src/app/modules/layout/services/theme.service';
import { NavigationService } from '@src/app/services/navigation.service';
import { MatDialog } from '@angular/material/dialog';
import { CreatePlaylistDialogComponent } from '@src/app/modules/shared/create-playlist-dialog/create-playlist-dialog.component';

@Component({
  selector: 'maheta-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.scss'],
})
export class AppBarComponent {
  constructor(
    private themeService: ThemeService,
    private navigation: NavigationService,
    private databaseService: DatabaseService,
    private matDialogService: MatDialog
  ) {}

  public get themeClass(): ThemeClassEnum {
    return this.themeService.theme;
  }

  public back(): void {
    this.navigation.back();
  }

  public openCreatePlaylistDialog(): void {
    // const data: AddToPlaylistDialogData = {
    //   track,
    // };
    this.matDialogService.open(CreatePlaylistDialogComponent);
  }

  public switchTheme(): void {
    this.themeService.switchTheme();
  }

  public isCurrentTabPlaylists(): boolean {
    return this.navigation.bottomNavTabUrl === UrlEnum.PLAYLISTS;
  }
}
