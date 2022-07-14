import { Component, OnInit } from '@angular/core';

import { ThemeClassEnum, ThemeService } from '@app/modules/layout/services/theme.service';

interface BottomNavTab {
  icon: string;
  name: string;
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
        name: 'Player',
      },
      {
        icon: 'library_music',
        name: 'Songs',
      },
      {
        icon: 'album',
        name: 'Albums',
      },
      {
        icon: 'playlist_play',
        name: 'Playlists',
      },
    ];
  }
}
