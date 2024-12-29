import { Component, OnInit } from '@angular/core';

import { Track } from '@src/app/db/domain/track.schema';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { MusicLibraryTracksService } from '@src/app/services/music-library/music-library-tracks.service';

import { takeUntil } from 'rxjs';

@Component({
  selector: 'maheta-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent extends BaseComponent implements OnInit {
  public tracks: Track[];
  public currentTrack: Track;

  constructor(
    private musicLibraryTracksService: MusicLibraryTracksService,
    private musicControlService: MusicControlService
  ) {
    super();
  }

  public get isSortingOrderAscending(): boolean {
    return this.musicControlService.isSortingOrderAscending;
  }

  public ngOnInit(): void {
    this.musicControlService.currentTrack$.subscribe(
      (track: Track) => (this.currentTrack = { ...track })
    );
    this.musicLibraryTracksService.tracks$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((tracks: Track[]) => (this.tracks = tracks));
  }
}
