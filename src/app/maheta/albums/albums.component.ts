import { Component } from '@angular/core';

import { Album } from '@src/app/db/domain/album';
import { MusicLibraryService } from '@src/app/services/music-library.service';

@Component({
  selector: 'maheta-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
})
export class AlbumsComponent {
  constructor(private musicLibraryService: MusicLibraryService) {}

  public get albums(): Album[] {
    return this.musicLibraryService.albums;
  }
}
