import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Album, getDefaultAlbum } from '@src/app/db/domain/album';
import { Track } from '@src/app/db/domain/track.schema';
import { UrlParamsEnum } from '@src/app/model/url-params.enum';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { MusicLibraryAlbumsService } from '@src/app/services/music-library/music-library-albums.service';

import { takeUntil } from 'rxjs';

@Component({
  selector: 'maheta-album-tracks',
  templateUrl: './album-tracks.component.html',
  styleUrls: ['./album-tracks.component.scss'],
})
export class AlbumTracksComponent extends BaseComponent implements OnInit {
  public album: Album;
  public currentTrack: Track;

  private _albumTitle: string = '';
  constructor(
    private musicLibraryAlbumsService: MusicLibraryAlbumsService,
    private musicControlService: MusicControlService,
    private route: ActivatedRoute
  ) {
    super();
  }

  public ngOnInit(): void {
    this._albumTitle = this.route.snapshot.paramMap.get(UrlParamsEnum.albumTitle) ?? '';
    this.musicControlService.currentTrack$.subscribe((track: Track) => (this.currentTrack = track));
    this.musicLibraryAlbumsService
      .getAlbum(this._albumTitle)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((album) => {
        this.album = album || getDefaultAlbum();
      });
  }
}
