import { Component, OnInit } from '@angular/core';
import { environment } from '@environment/environment';

import { UrlEnum } from '@src/app/model/url.enum';
import { ThemeClassEnum, ThemeService } from '@src/app/modules/layout/services/theme.service';

interface BottomNavTab {
  icon: string;
  name: string;
  link: string;
}

@Component({
  selector: 'maheta-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  public bottomNavTabs: BottomNavTab[];
  public activeTabName: string;

  constructor(private themeService: ThemeService) {}

  public get theme(): ThemeClassEnum {
    return this.themeService.theme;
  }

  public ngOnInit(): void {
    this.setupBottomNav();
  }

  public switchTheme(): void {
    this.themeService.switchTheme();
  }

  public selectTab(tab: BottomNavTab): void {
    this.activeTabName = tab.name;
  }

  public isTabActive(tab: BottomNavTab): boolean {
    return this.activeTabName === tab.name;
  }

  private setupBottomNav(): void {
    this.bottomNavTabs = [
      {
        icon: 'play_arrow',
        name: environment.locales.MAHETA.BOTTOM_NAVIGATION.player,
        link: UrlEnum.PLAYER,
      },
      {
        icon: 'library_music',
        name: environment.locales.MAHETA.BOTTOM_NAVIGATION.songs,
        link: UrlEnum.SONGS,
      },
      {
        icon: 'album',
        name: environment.locales.MAHETA.BOTTOM_NAVIGATION.albums,
        link: UrlEnum.ALBUMS,
      },
      {
        icon: 'playlist_play',
        name: environment.locales.MAHETA.BOTTOM_NAVIGATION.playlists,
        link: UrlEnum.PLAYLISTS,
      },
    ];
    this.activeTabName = environment.locales.MAHETA.BOTTOM_NAVIGATION.songs;
  }
}
