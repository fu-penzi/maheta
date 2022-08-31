import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DatabaseService } from '@src/app/db/database.service';
import { Playlist } from '@src/app/db/domain/playlist.schema';
import { Track } from '@src/app/db/domain/track.schema';
import { UrlParamsEnum } from '@src/app/model/url-params.enum';
import { MusicLibraryService } from '@src/app/services/music-library.service';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'maheta-playlist-tracks',
  templateUrl: './playlist-tracks.component.html',
  styleUrls: ['./playlist-tracks.component.scss'],
})
export class PlaylistTracksComponent implements OnInit {
  public playlist: Playlist | undefined;
  public playlistTracks$: Observable<Track[]>;

  constructor(
    private musicLibraryService: MusicLibraryService,
    private databaseService: DatabaseService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    const playlistId: string = this.route.snapshot.paramMap.get(UrlParamsEnum.playlistId) ?? '';
    this.playlist = this.musicLibraryService.getPlaylist(playlistId);

    this.playlistTracks$ = this.playlist
      ? this.databaseService.getPlaylistTracks$(this.playlist)
      : of([]);
  }
}
