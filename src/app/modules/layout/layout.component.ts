import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

import { PlatformEnum } from '@src/app/model/platform.enum';
import { UrlEnum } from '@src/app/model/url.enum';
import { ThemeClassEnum, ThemeService } from '@src/app/modules/layout/services/theme.service';
import { MahetaService } from '@src/app/services/maheta.service';
import { NavigationService } from '@src/app/services/navigation.service';

import { TranslateService } from '@ngx-translate/core';

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
  @ViewChild('drawer') drawer: MatDrawer;
  @HostBinding('class.web') isWeb: boolean = ![PlatformEnum.ANDROID, PlatformEnum.IOS].includes(
    Capacitor.getPlatform() as PlatformEnum
  );
  @HostBinding('class.mobile') isMobile: boolean = [
    PlatformEnum.ANDROID,
    PlatformEnum.IOS,
  ].includes(Capacitor.getPlatform() as PlatformEnum);

  public bottomNavTabs: BottomNavTab[];
  public playerOpenAnimations = {
    open: false,
    close: false,
  };

  constructor(
    private themeService: ThemeService,
    private navigation: NavigationService,
    private translate: TranslateService,
    private mahetaService: MahetaService
  ) {}

  public get themeClass(): ThemeClassEnum {
    return this.themeService.theme;
  }

  public ngOnInit(): void {
    SplashScreen.hide();
    this.setupBottomNav();
    this.mahetaService.playerSheetOpen$.subscribe((isOpen: boolean) => {
      this.playerOpenAnimations.open = isOpen;
      this.playerOpenAnimations.close = !isOpen;
    });
  }

  public selectTab(tab: BottomNavTab): void {
    this.navigation.bottomNavTabUrl = tab.url;
    this.drawer?.toggle();
  }

  public isTabActive(tab: BottomNavTab): boolean {
    return this.navigation.bottomNavTabUrl === tab.url;
  }

  private setupBottomNav(): void {
    this.bottomNavTabs = [
      {
        icon: 'library_music',
        name: this.translate.instant('TABS.songs'),
        url: UrlEnum.SONGS,
      },
      {
        icon: 'album',
        name: this.translate.instant('TABS.albums'),
        url: UrlEnum.ALBUMS,
      },
      {
        icon: 'playlist_play',
        name: this.translate.instant('TABS.playlists'),
        url: UrlEnum.PLAYLISTS,
      },
    ];
  }
}
