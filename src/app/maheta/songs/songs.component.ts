import { Component, OnInit } from '@angular/core';

import { Track } from '@src/app/db/domain/track.schema';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MusicLibraryTracksService } from '@src/app/services/music-library/music-library-tracks.service';

import { takeUntil } from 'rxjs';

@Component({
  selector: 'maheta-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent extends BaseComponent implements OnInit {
  public tracks: Track[] = [];
  constructor(private musicLibraryTracksService: MusicLibraryTracksService) {
    super();
  }

  public ngOnInit(): void {
    this.musicLibraryTracksService.tracks$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((tracks: Track[]) => (this.tracks = tracks));
  }
}
