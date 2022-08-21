import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Playlist } from '@src/app/db/domain/playlist.schema';
import { Track } from '@src/app/db/domain/track.schema';
import { UrlParamsEnum } from '@src/app/model/url-params.enum';
import { MusicLibraryService } from '@src/app/services/music-library.service';
import { tracksMock } from '@src/mock/tracks';

@Component({
  selector: 'maheta-playlist-tracks',
  templateUrl: './playlist-tracks.component.html',
  styleUrls: ['./playlist-tracks.component.scss'],
})
export class PlaylistTracksComponent implements OnInit {
  public playlist: Playlist | undefined;

  constructor(private musicLibraryService: MusicLibraryService, private route: ActivatedRoute) {}

  public get playlistTracks(): Track[] {
    // return this.playlist?.tracks ?? [];
    return tracksMock;
  }

  public ngOnInit(): void {
    const playlistId: string = this.route.snapshot.paramMap.get(UrlParamsEnum.playlistId) ?? '';
    this.playlist = this.musicLibraryService.getPlaylist(playlistId);
  }
}
