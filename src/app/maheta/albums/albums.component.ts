import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { Album } from '@src/app/db/domain/album';
import { UrlEnum } from '@src/app/model/url.enum';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MusicLibraryAlbumsService } from '@src/app/services/music-library/music-library-albums.service';

import { filter, takeUntil } from 'rxjs';

@Component({
  selector: 'maheta-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
})
export class AlbumsComponent extends BaseComponent implements OnInit {
  public albums: Album[] = [];
  public displayAlbumTracks: boolean = false;

  public initAnimations: boolean = false;
  constructor(
    private musicLibraryAlbumsService: MusicLibraryAlbumsService,
    private router: Router
  ) {
    super();
  }

  public ngOnInit(): void {
    this.router.events
      .pipe(
        takeUntil(this.onDestroy$),
        filter((event) => event instanceof NavigationStart)
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.initAnimations = true;
          this.displayAlbumTracks = event.url.includes(UrlEnum.ALBUMS + '/');
        }
      });

    this.musicLibraryAlbumsService.albums$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((albums: Album[]) => {
        this.albums = albums;
      });
  }
}
