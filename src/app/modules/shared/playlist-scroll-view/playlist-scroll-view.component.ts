import { Component, Input } from '@angular/core';

import { Playlist } from '@src/app/db/domain/playlist.schema';
import { MusicLibraryPlaylistsService } from '@src/app/services/music-library/music-library-playlists.service';

@Component({
  selector: 'maheta-playlist-scroll-view',
  templateUrl: './playlist-scroll-view.component.html',
  styleUrls: ['./playlist-scroll-view.component.scss'],
})
export class PlaylistScrollViewComponent {
  @Input() public playlists: Playlist[];

  constructor(private musicLibraryPlaylistsService: MusicLibraryPlaylistsService) {}

  public getPlaylistLength(playlist: Playlist): number {
    return playlist.tracks?.length ?? 0;
  }

  public playlistByIndex(index: number): number {
    return index;
  }

  public deletePlaylist(playlist: Playlist): void {
    this.musicLibraryPlaylistsService.deletePlaylist$(playlist).subscribe();
  }
}
