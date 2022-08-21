import { Component, Input, OnInit } from '@angular/core';

import { Track } from '@src/app/db/domain/track.schema';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';

@Component({
  selector: 'maheta-playlist-scroll-view',
  templateUrl: './playlist-scroll-view.component.html',
  styleUrls: ['./playlist-scroll-view.component.scss'],
})
export class PlaylistScrollViewComponent implements OnInit {
  @Input() public tracks: Track[];

  constructor(private readonly musicControlService: MusicControlService) {}

  public get currentTrack(): Track {
    return this.musicControlService.currentTrack;
  }

  public ngOnInit(): void {
    this.musicControlService.nextQueue = this.tracks;
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
