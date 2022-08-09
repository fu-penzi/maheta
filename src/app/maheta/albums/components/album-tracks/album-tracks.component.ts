import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Album } from '@src/app/db/domain/album';
import { Track } from '@src/app/db/domain/track.schema';
import { UrlParamsEnum } from '@src/app/model/url-params.enum';
import { MusicLibraryService } from '@src/app/services/music-library.service';

@Component({
  selector: 'maheta-album-tracks',
  templateUrl: './album-tracks.component.html',
  styleUrls: ['./album-tracks.component.scss'],
})
export class AlbumTracksComponent implements OnInit {
  public album: Album | undefined;

  constructor(private musicLibraryService: MusicLibraryService, private route: ActivatedRoute) {}

  public get albumTracks(): Track[] {
    return this.album?.tracks ?? [];
  }

  public ngOnInit(): void {
    const albumTitle: string = this.route.snapshot.paramMap.get(UrlParamsEnum.albumTitle) ?? '';
    this.album = this.musicLibraryService.getAlbum(albumTitle);
  }
}
