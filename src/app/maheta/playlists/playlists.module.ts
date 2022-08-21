import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@src/app/modules/shared/shared.module';

import { PlaylistsComponent } from '@maheta/playlists/playlists.component';
import { PlaylistTracksComponent } from '@maheta/playlists/components/playlist-tracks/playlist-tracks.component';
import { UrlParamsEnum } from '@src/app/model/url-params.enum';

@NgModule({
  declarations: [PlaylistsComponent, PlaylistTracksComponent],
  imports: [
    RouterModule.forChild([
      {
        path: ':' + UrlParamsEnum.playlistId,
        component: PlaylistTracksComponent,
      },
      {
        path: '',
        component: PlaylistsComponent,
      },
    ]),
    SharedModule,
  ],
})
export class PlaylistsModule {}
