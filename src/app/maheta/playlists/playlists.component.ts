import { Component } from '@angular/core';

import { Playlist } from '@src/app/db/domain/playlist.schema';
import { MusicLibraryPlaylistsService } from '@src/app/services/music-library/music-library-playlists.service';

@Component({
  selector: 'maheta-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent {
  constructor(private readonly musicLibraryPlaylistsService: MusicLibraryPlaylistsService) {}

  public get playlists(): Playlist[] {
    return this.musicLibraryPlaylistsService.playlists;
  }
}
