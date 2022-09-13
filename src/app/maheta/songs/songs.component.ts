import { Component } from '@angular/core';

import { Track } from '@src/app/db/domain/track.schema';
import { MusicLibraryTracksService } from '@src/app/services/music-library/music-library-tracks.service';

@Component({
  selector: 'maheta-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent {
  constructor(private musicLibraryTracksService: MusicLibraryTracksService) {}

  public get tracks(): Track[] {
    return this.musicLibraryTracksService.tracks;
  }
}
