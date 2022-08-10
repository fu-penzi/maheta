import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { UrlParamsEnum } from '@src/app/model/url-params.enum';
import { SharedModule } from '@src/app/modules/shared/shared.module';

import { AlbumsComponent } from '@maheta/albums/albums.component';
import { AlbumTracksComponent } from '@maheta/albums/components/album-tracks/album-tracks.component';

@NgModule({
  declarations: [AlbumsComponent, AlbumTracksComponent],
  imports: [
    RouterModule.forChild([
      {
        path: ':' + UrlParamsEnum.albumTitle,
        component: AlbumTracksComponent,
      },
      {
        path: '',
        component: AlbumsComponent,
      },
    ]),
    SharedModule,
    MatButtonModule,
    MatIconModule,
    ScrollingModule,
  ],
})
export class AlbumsModule {}
