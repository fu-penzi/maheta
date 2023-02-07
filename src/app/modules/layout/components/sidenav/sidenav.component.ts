import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { UrlEnum } from '@src/app/model/url.enum';
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
  selector: 'maheta-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  @ViewChild('ionMenu') ionMenu: IonMenu;
  @Input() playerSheetOpen: boolean = false;

  public navTabs: NavTab[];
  constructor(private navigationService: NavigationService, private translate: TranslateService) {}

  public ngOnInit(): void {
    this.setupBottomNav();
    this.navigationService.overlayOpen$.subscribe((isOpen: boolean) => {
      this.playerSheetOpen = isOpen;
    });
  }

  public selectTab(tab: NavTab): void {
    this.navigationService.bottomNavTabUrl = tab.url;
    this.ionMenu.close();
  }

  public isTabActive(tab: NavTab): boolean {
    return this.navigationService.bottomNavTabUrl === tab.url;
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
