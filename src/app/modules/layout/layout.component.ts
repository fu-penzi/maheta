import { Component, OnInit } from '@angular/core';

import { ThemeClassEnum, ThemeService } from '@app/modules/layout/services/theme.service';
import { environment } from '@environment/environment';
import { UrlEnum } from '@app/model/url.enum';

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

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.setupBottomNav();
  }

  public switchTheme(): void {
    this.themeService.switchTheme();
  }

  public get theme(): ThemeClassEnum {
    return this.themeService.theme;
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
  }
}
