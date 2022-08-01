import { Component } from '@angular/core';

import { MusicLibraryService } from '@src/app/services/music-library.service';
import { Track } from '@src/app/db/domain/track.schema';

@Component({
  selector: 'maheta-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent {
  constructor(private readonly musicLibraryService: MusicLibraryService) {}

  public get tracks(): Track[] {
    return this.musicLibraryService.tracks;
  }
}
