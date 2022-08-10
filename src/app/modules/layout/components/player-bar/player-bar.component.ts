import { Component } from '@angular/core';

import { Track } from '@src/app/db/domain/track.schema';
import { UrlEnum } from '@src/app/model/url.enum';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { NavigationService } from '@src/app/services/navigation.service';

@Component({
  selector: 'maheta-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss'],
})
export class PlayerBarComponent {
  constructor(
    private musicControlService: MusicControlService,
    private navigation: NavigationService
  ) {}

  public get currentTrack(): Track {
    return this.musicControlService.currentTrack;
  }

  public get isTabPlayer(): boolean {
    return this.navigation.bottomNavTabUrl === UrlEnum.PLAYER;
  }

  public get playerRouterLink(): string {
    return UrlEnum.PLAYER;
  }

  public play(): void {
    this.musicControlService.play();
  }

  public pause(): void {
    this.musicControlService.pause();
  }

  public next(): void {
    this.musicControlService.next();
  }

  public prev(): void {
    this.musicControlService.prev();
  }

  public isPlaying(): boolean {
    return this.musicControlService.isPlaying;
  }
}
