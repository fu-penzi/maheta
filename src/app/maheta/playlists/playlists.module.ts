import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@src/app/modules/shared/shared.module';

import { PlaylistsComponent } from '@maheta/playlists/playlists.component';

@NgModule({
  declarations: [PlaylistsComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PlaylistsComponent,
      },
    ]),
    SharedModule,
  ],
})
export class PlaylistsModule {}
