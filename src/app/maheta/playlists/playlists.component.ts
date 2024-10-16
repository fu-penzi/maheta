import { Component, OnInit } from '@angular/core';

import { Playlist } from '@src/app/db/domain/playlist.schema';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MusicLibraryPlaylistsService } from '@src/app/services/music-library/music-library-playlists.service';

import { takeUntil } from 'rxjs';

@Component({
  selector: 'maheta-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent extends BaseComponent implements OnInit {
  public playlists: Playlist[] = [];

  constructor(private readonly musicLibraryPlaylistsService: MusicLibraryPlaylistsService) {
    super();
  }

  public ngOnInit(): void {
    this.musicLibraryPlaylistsService.playlists$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playlists: Playlist[]) => (this.playlists = playlists));
  }
}
