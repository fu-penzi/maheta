import { Component, HostBinding, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { environment } from '@environment/environment';

import { PlatformEnum } from '@src/app/model/platform.enum';
import { UrlEnum } from '@src/app/model/url.enum';
import { ThemeClassEnum, ThemeService } from '@src/app/modules/layout/services/theme.service';
import { NavigationService } from '@src/app/services/navigation.service';

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
  @HostBinding('class.web') isWeb: boolean = false;
  @HostBinding('class.mobile') isMobile: boolean = false;

  public bottomNavTabs: BottomNavTab[];
  public activeTabName: string;

  constructor(private themeService: ThemeService, private navigation: NavigationService) {}

  public get themeClass(): ThemeClassEnum {
    return this.themeService.theme;
  }

  public ngOnInit(): void {
    //TODO fix this
    if (
      [PlatformEnum.ANDROID, PlatformEnum.IOS].includes(Capacitor.getPlatform() as PlatformEnum)
    ) {
      this.isMobile = true;
    } else {
      this.isWeb = true;
    }

    this.setupBottomNav();
  }

  public back(): void {
    this.navigation.back();
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
