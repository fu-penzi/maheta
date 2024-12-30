import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Playlist } from '@src/app/db/domain/playlist';
import { Track } from '@src/app/db/domain/track';
import { UrlParamsEnum } from '@src/app/model/url-params.enum';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { MusicLibraryPlaylistsService } from '@src/app/services/music-library/music-library-playlists.service';
import { NavigationService } from '@src/app/services/navigation.service';

import { takeUntil } from 'rxjs';

@Component({
  selector: 'maheta-playlist-tracks',
  templateUrl: './playlist-tracks.component.html',
  styleUrls: ['./playlist-tracks.component.scss'],
})
export class PlaylistTracksComponent extends BaseComponent implements OnInit {
  public playlist: Playlist;
  public currentTrack: Track;

  constructor(
    private musicControlService: MusicControlService,
    private musicLibraryPlaylistsService: MusicLibraryPlaylistsService,
    private route: ActivatedRoute,
    private navigationService: NavigationService
  ) {
    super();
  }

  public get isSortingOrderAscending(): boolean {
    return this.musicControlService.isSortingOrderAscending;
  }

  public ngOnInit(): void {
    const playlistId: string = this.route.snapshot.paramMap.get(UrlParamsEnum.playlistId) ?? '';
    this.musicControlService.currentTrack$.subscribe((track: Track) => (this.currentTrack = track));
    this.musicLibraryPlaylistsService
      .getPlaylist$(playlistId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playlist: Playlist) => {
        this.playlist = playlist;
        this.navigationService.currentTabName = playlist.name;
      });
  }
}
