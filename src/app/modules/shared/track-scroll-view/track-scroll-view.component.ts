import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';

import { PlatformEnum } from '@src/app/model/platform.enum';
import { Track } from '@src/app/model/track.types';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { images } from '@src/mock/images';

@Component({
  selector: 'maheta-track-scroll-view',
  templateUrl: './track-scroll-view.component.html',
  styleUrls: ['./track-scroll-view.component.scss'],
})
export class TrackScrollViewComponent implements OnInit {
  @HostBinding('class.web') isWeb: boolean = false;
  @HostBinding('class.mobile') isMobile: boolean = false;

  @Input() public tracks: Track[];

  public images: string[] = images;

  constructor(private readonly musicControlService: MusicControlService) {}

  public get currentTrack(): Track {
    return this.musicControlService.currentTrack;
  }

  public ngOnInit(): void {
    this.musicControlService.nextQueue = this.tracks;

    //TODO fix this
    if (
      [PlatformEnum.ANDROID, PlatformEnum.IOS].includes(Capacitor.getPlatform() as PlatformEnum)
    ) {
      this.isMobile = true;
    } else {
      this.isWeb = true;
    }
  }

  public playPosition(position: number): void {
    this.musicControlService.playPosition(position);
  }

  public trackByIndex(index: number): number {
    return index;
  }

  public isCurrentTrack(track: Track): boolean {
    if (!this.currentTrack) {
      return false;
    }
    return this.currentTrack.uri === track.uri;
  }
}
