import { Component } from '@angular/core';

import { Album } from '@src/app/db/domain/album';
import { MusicLibraryAlbumsService } from '@src/app/services/music-library/music-library-albums.service';

@Component({
  selector: 'maheta-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
})
export class AlbumsComponent {
  constructor(private musicLibraryAlbumsService: MusicLibraryAlbumsService) {}

  public get albums(): Album[] {
    return this.musicLibraryAlbumsService.albums;
  }
}
