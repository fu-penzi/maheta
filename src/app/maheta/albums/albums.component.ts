import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Album } from '@src/app/db/domain/album';
import { Track } from '@src/app/db/domain/track.schema';
import { UrlParamsEnum } from '@src/app/model/url-params.enum';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { MusicLibraryAlbumsService } from '@src/app/services/music-library/music-library-albums.service';
import { NavigationService } from '@src/app/services/navigation.service';
import { StackingContextService } from '@src/app/services/stacking-context.service';

import { Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'maheta-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
})
export class AlbumsComponent extends BaseComponent implements OnInit {
  public albums: Album[];
  public currentAlbum: Album;
  public currentTrack: Track;

  constructor(
    private musicLibraryAlbumsService: MusicLibraryAlbumsService,
    private stackingContextService: StackingContextService,
    private musicControlService: MusicControlService,
    private router: Router,
    private route: ActivatedRoute,
    private navigationService: NavigationService
  ) {
    super();
  }

  public get showStackingContext(): boolean {
    return this.stackingContextService.showStackingContext;
  }

  public get currentTrack$(): Observable<Track> {
    return this.musicControlService.currentTrack$;
  }

  public ngOnInit(): void {
    this.stackingContextService.currentAlbum$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((currentAlbum: Album) => (this.currentAlbum = currentAlbum));
    this.musicLibraryAlbumsService.albums$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((albums: Album[]) => (this.albums = albums));

    const albumTitle: string | null = this.route.snapshot.queryParamMap.get(
      UrlParamsEnum.albumTitle
    );
    if (albumTitle) {
      this.navigateToAlbumTracks(albumTitle);
    }
  }

  public navigateToAlbumTracks(albumTitle: string): void {
    this.router
      .navigate([''], { queryParams: { [UrlParamsEnum.albumTitle]: albumTitle } })
      .then(() => {
        this.navigationService.currentTabName = this.currentAlbum.title;
      });
  }

  public trackByAlbum(index: number, item: Album): string {
    return item.title;
  }
}
