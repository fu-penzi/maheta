import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

import { Album } from '@src/app/db/domain/album';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MusicLibraryAlbumsService } from '@src/app/services/music-library/music-library-albums.service';

import { interval, takeUntil } from 'rxjs';

@Component({
  selector: 'maheta-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
})
export class AlbumsComponent extends BaseComponent implements OnInit {
  @ViewChild('itemsContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('item', { read: TemplateRef }) template: TemplateRef<any>;

  public firstChunk: Album[] = [];

  private _albums: Album[] = [];

  private readonly _firstChunkSize: number = 9;

  constructor(private musicLibraryAlbumsService: MusicLibraryAlbumsService) {
    super();
  }

  public ngOnInit(): void {
    this.musicLibraryAlbumsService.albums$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((albums: Album[]) => {
        this._albums = albums;
        this.firstChunk = albums.slice(0, this._firstChunkSize);
        this.buildData(this._firstChunkSize, albums.length);
      });
  }

  private buildData(startIndex: number, length: number): void {
    const ITEMS_RENDERED_AT_ONCE = 3;

    let currentIndex = startIndex;
    interval(10).subscribe(() => {
      for (let i = currentIndex; i < currentIndex + ITEMS_RENDERED_AT_ONCE; i++) {
        if (i >= length) {
          break;
        }
        const context = {
          $implicit: this._albums[i],
        };
        this.container.createEmbeddedView(this.template, context);
      }
      currentIndex += ITEMS_RENDERED_AT_ONCE;
    });
  }
}
