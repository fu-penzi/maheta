import { Component } from '@angular/core';

import { Track } from '@src/app/model/track.types';
import { MusicControlService } from '@src/app/services/music-control.service';
import { MusicLibraryService } from '@src/app/services/music-library.service';
import { images } from '@src/mock/images';

@Component({
  selector: 'maheta-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent {
  public images = images;

  constructor(
    private readonly musicLibraryService: MusicLibraryService,
    private readonly musicControlService: MusicControlService
  ) {}

  public get tracks(): Track[] {
    return this.musicLibraryService.tracks;
  }

  public play(track: Track): void {
    this.musicControlService.playTrack(track);
  }
}
