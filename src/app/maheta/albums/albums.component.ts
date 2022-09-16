import { Component, OnInit } from '@angular/core';

import { Album } from '@src/app/db/domain/album';
import { MusicLibraryAlbumsService } from '@src/app/services/music-library/music-library-albums.service';

@Component({
  selector: 'maheta-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
})
export class AlbumsComponent implements OnInit {
  public albums: Album[] = [];
  constructor(private musicLibraryAlbumsService: MusicLibraryAlbumsService) {}

  public ngOnInit(): void {
    this.musicLibraryAlbumsService.albums$.subscribe((albums: Album[]) => (this.albums = albums));
  }
}
