import { Component, OnInit } from '@angular/core';

import { Track } from '@src/app/db/domain/track.schema';
import { MusicLibraryTracksService } from '@src/app/services/music-library/music-library-tracks.service';

@Component({
  selector: 'maheta-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent implements OnInit {
  public tracks: Track[] = [];
  constructor(private musicLibraryTracksService: MusicLibraryTracksService) {}

  public ngOnInit(): void {
    this.tracks = this.musicLibraryTracksService.tracks;
  }
}
