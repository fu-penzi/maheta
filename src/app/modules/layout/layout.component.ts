import { Component, OnInit, ViewChild } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';

import { UrlEnum } from '@src/app/model/url.enum';
import { ThemeClassEnum, ThemeService } from '@src/app/modules/layout/services/theme.service';
import { MahetaService } from '@src/app/services/maheta.service';
import { NavigationService } from '@src/app/services/navigation.service';

import { IonMenu } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

interface NavTab {
  icon: string;
  name: string;
  url: UrlEnum;
  dividerBelow?: boolean;
}

@Component({
  selector: 'maheta-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  @ViewChild('ionMenu') ionMenu: IonMenu;
  public navTabs: NavTab[];
  public playerSheetOpen: boolean = false;

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
      this.playerSheetOpen = isOpen;
    });
  }

  public selectTab(tab: NavTab): void {
    this.navigation.bottomNavTabUrl = tab.url;
    this.ionMenu.close();
  }

  public isTabActive(tab: NavTab): boolean {
    return this.navigation.bottomNavTabUrl === tab.url;
  }

  private setupBottomNav(): void {
    this.navTabs = [
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
        dividerBelow: true,
      },
      {
        icon: 'settings',
        name: this.translate.instant('APP_BAR.settings'),
        url: UrlEnum.SETTINGS,
      },
    ];
  }
}
