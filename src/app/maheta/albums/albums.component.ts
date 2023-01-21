import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

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
  @ViewChild('itemsContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('item', { read: TemplateRef }) template: TemplateRef<any>;

  private _albums: Album[] = [];

  constructor(private musicLibraryAlbumsService: MusicLibraryAlbumsService) {
    super();
  }

  public ngOnInit(): void {
    this.musicLibraryAlbumsService.albums$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((albums: Album[]) => {
        this._albums = albums;
        this.buildData(albums.length);
      });
  }

  private buildData(length: number): void {
    const ITEMS_RENDERED_AT_ONCE = 10;
    const INTERVAL_IN_MS = 10;

    let currentIndex = 0;

    const interval = setInterval(() => {
      const nextIndex = currentIndex + ITEMS_RENDERED_AT_ONCE;

      for (let i = currentIndex; i <= nextIndex; i++) {
        if (i >= length) {
          clearInterval(interval);
          break;
        }
        const context = {
          $implicit: this._albums[i],
        };
        this.container.createEmbeddedView(this.template, context);
      }

      currentIndex += ITEMS_RENDERED_AT_ONCE;
    }, INTERVAL_IN_MS);
  }
}
