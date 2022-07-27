import { Component, Input, OnInit } from '@angular/core';
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
  @Input() public tracks: Track[];

  public images: string[] = images;
  public isMobile: boolean;

  constructor(private readonly musicControlService: MusicControlService) {}

  public ngOnInit(): void {
    this.musicControlService.nextQueue = this.tracks;
    this.isMobile = [PlatformEnum.ANDROID, PlatformEnum.IOS].includes(
      Capacitor.getPlatform() as PlatformEnum
    );
  }

  public playPosition(position: number): void {
    this.musicControlService.playPosition(position);
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
