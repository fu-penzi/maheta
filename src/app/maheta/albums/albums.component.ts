import { Component, OnInit } from '@angular/core';

import { Album } from '@src/app/db/domain/album';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MusicLibraryAlbumsService } from '@src/app/services/music-library/music-library-albums.service';

import { takeUntil } from 'rxjs';

@Component({
  selector: 'maheta-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
})
export class AlbumsComponent extends BaseComponent implements OnInit {
  public albums: Album[] = [];
  constructor(private musicLibraryAlbumsService: MusicLibraryAlbumsService) {
    super();
  }

  public ngOnInit(): void {
    this.musicLibraryAlbumsService.albums$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((albums: Album[]) => (this.albums = albums));
  }
}
