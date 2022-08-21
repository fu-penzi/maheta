import { Component, Input } from '@angular/core';

import { Playlist } from '@src/app/db/domain/playlist.schema';

@Component({
  selector: 'maheta-playlist-scroll-view',
  templateUrl: './playlist-scroll-view.component.html',
  styleUrls: ['./playlist-scroll-view.component.scss'],
})
export class PlaylistScrollViewComponent {
  @Input() public playlists: Playlist[];

  public playlistByIndex(index: number): number {
    return index;
  }
}
