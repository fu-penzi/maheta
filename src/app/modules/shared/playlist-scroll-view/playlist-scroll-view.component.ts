import { Component, Input } from '@angular/core';
import { environment } from '@environment/environment';

import { DatabaseService } from '@src/app/db/database.service';
import { Playlist } from '@src/app/db/domain/playlist.schema';

@Component({
  selector: 'maheta-playlist-scroll-view',
  templateUrl: './playlist-scroll-view.component.html',
  styleUrls: ['./playlist-scroll-view.component.scss'],
})
export class PlaylistScrollViewComponent {
  @Input() public playlists: Playlist[];

  constructor(private databaseService: DatabaseService) {}

  public getPlaylistLengthCaption(playlist: Playlist): string {
    const playlistLength = playlist.tracks?.length || 0;
    return environment.locales.MAHETA.PLAYLIST.lengthCaption(playlistLength);
  }

  public playlistByIndex(index: number): number {
    return index;
  }

  public deletePlaylist(playlist: Playlist): void {
    this.databaseService.deletePlaylist(playlist);
  }
}
