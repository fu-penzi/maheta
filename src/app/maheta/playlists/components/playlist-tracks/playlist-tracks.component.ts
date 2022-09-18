import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Playlist } from '@src/app/db/domain/playlist.schema';
import { UrlParamsEnum } from '@src/app/model/url-params.enum';
import { MusicLibraryPlaylistsService } from '@src/app/services/music-library/music-library-playlists.service';

@Component({
  selector: 'maheta-playlist-tracks',
  templateUrl: './playlist-tracks.component.html',
  styleUrls: ['./playlist-tracks.component.scss'],
})
export class PlaylistTracksComponent implements OnInit {
  public playlist: Playlist;

  constructor(
    private musicLibraryPlaylistsService: MusicLibraryPlaylistsService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    const playlistId: string = this.route.snapshot.paramMap.get(UrlParamsEnum.playlistId) ?? '';
    this.musicLibraryPlaylistsService
      .getPlaylist$(playlistId)
      .subscribe((playlist: Playlist) => (this.playlist = playlist));
  }
}
