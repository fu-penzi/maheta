import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UrlParamsEnum } from '@src/app/model/url-params.enum';
import { SharedModule } from '@src/app/modules/shared/shared.module';

import { PlaylistTracksComponent } from '@maheta/playlists/components/playlist-tracks/playlist-tracks.component';
import { PlaylistsComponent } from '@maheta/playlists/playlists.component';

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
