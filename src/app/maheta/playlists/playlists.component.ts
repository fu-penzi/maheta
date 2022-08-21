import { Component } from '@angular/core';

import { Playlist } from '@src/app/db/domain/playlist.schema';
import { MusicLibraryService } from '@src/app/services/music-library.service';

@Component({
  selector: 'maheta-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent {
  constructor(private readonly musicLibraryService: MusicLibraryService) {}

  public get playlists(): Playlist[] {
    return this.musicLibraryService.playlists;
  }
}
