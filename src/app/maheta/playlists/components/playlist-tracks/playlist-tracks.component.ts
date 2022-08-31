import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DatabaseService } from '@src/app/db/database.service';
import { Playlist } from '@src/app/db/domain/playlist.schema';
import { Track } from '@src/app/db/domain/track.schema';
import { UrlParamsEnum } from '@src/app/model/url-params.enum';
import { MusicLibraryService } from '@src/app/services/music-library.service';

@Component({
  selector: 'maheta-playlist-tracks',
  templateUrl: './playlist-tracks.component.html',
  styleUrls: ['./playlist-tracks.component.scss'],
})
export class PlaylistTracksComponent implements OnInit {
  public playlist: Playlist | undefined;
  public playlistTracks: Track[] = [];

  constructor(
    private musicLibraryService: MusicLibraryService,
    private databaseService: DatabaseService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    const playlistId: string = this.route.snapshot.paramMap.get(UrlParamsEnum.playlistId) ?? '';
    this.playlist = this.musicLibraryService.getPlaylist(playlistId);
    if (this.playlist) {
      this.databaseService.getPlaylistTracks$(this.playlist).subscribe((tracks: Track[]) => {
        this.playlistTracks = tracks;
      });
    }
  }
}
