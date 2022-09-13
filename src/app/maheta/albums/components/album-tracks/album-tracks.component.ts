import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Album } from '@src/app/db/domain/album';
import { Track } from '@src/app/db/domain/track.schema';
import { UrlParamsEnum } from '@src/app/model/url-params.enum';
import { MusicLibraryAlbumsService } from '@src/app/services/music-library/music-library-albums.service';

@Component({
  selector: 'maheta-album-tracks',
  templateUrl: './album-tracks.component.html',
  styleUrls: ['./album-tracks.component.scss'],
})
export class AlbumTracksComponent implements OnInit {
  private _albumTitle: string = '';
  constructor(
    private musicLibraryAlbumsService: MusicLibraryAlbumsService,
    private route: ActivatedRoute
  ) {}

  public get album(): Album | undefined {
    return this.musicLibraryAlbumsService.getAlbum(this._albumTitle);
  }

  public get albumTracks(): Track[] {
    return this.album?.tracks ?? [];
  }

  public ngOnInit(): void {
    this._albumTitle = this.route.snapshot.paramMap.get(UrlParamsEnum.albumTitle) ?? '';
  }
}
