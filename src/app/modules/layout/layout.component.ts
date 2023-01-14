import { Component, HostBinding, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

import { PlatformEnum } from '@src/app/model/platform.enum';
import { UrlEnum } from '@src/app/model/url.enum';
import { ThemeClassEnum, ThemeService } from '@src/app/modules/layout/services/theme.service';
import { NavigationService } from '@src/app/services/navigation.service';
import { locales } from '@src/locales/locales';

interface BottomNavTab {
  icon: string;
  name: string;
  url: UrlEnum;
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
    SplashScreen.hide();
  }

  public selectTab(tab: BottomNavTab): void {
    this.navigation.bottomNavTabUrl = tab.url;
  }

  public isTabActive(tab: BottomNavTab): boolean {
    return this.navigation.bottomNavTabUrl === tab.url;
  }

  private setupBottomNav(): void {
    this.bottomNavTabs = [
      {
        icon: 'library_music',
        name: locales.BOTTOM_NAVIGATION.songs,
        url: UrlEnum.SONGS,
      },
      {
        icon: 'album',
        name: locales.BOTTOM_NAVIGATION.albums,
        url: UrlEnum.ALBUMS,
      },
      {
        icon: 'playlist_play',
        name: locales.BOTTOM_NAVIGATION.playlists,
        url: UrlEnum.PLAYLISTS,
      },
    ];
  }
}
