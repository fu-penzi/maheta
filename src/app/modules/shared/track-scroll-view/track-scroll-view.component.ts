import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Capacitor } from '@capacitor/core';

import { Track } from '@src/app/db/domain/track.schema';
import { PlatformEnum } from '@src/app/model/platform.enum';
import {
  AddToPlaylistDialogComponent,
  AddToPlaylistDialogData,
} from '@src/app/modules/shared/add-to-playlist-dialog/add-to-playlist-dialog.component';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';

@Component({
  selector: 'maheta-track-scroll-view',
  templateUrl: './track-scroll-view.component.html',
  styleUrls: ['./track-scroll-view.component.scss'],
})
export class TrackScrollViewComponent implements OnInit {
  @HostBinding('class.web') isWeb: boolean = false;
  @HostBinding('class.mobile') isMobile: boolean = false;

  @Input() public tracks: Track[];

  constructor(
    private readonly musicControlService: MusicControlService,
    public matDialogService: MatDialog
  ) {}

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

  public openAddToPlaylistDialog(track: Track): void {
    const data: AddToPlaylistDialogData = {
      track,
    };
    this.matDialogService.open(AddToPlaylistDialogComponent, { data });
  }
}
