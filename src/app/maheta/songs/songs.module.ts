import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@src/app/modules/shared/shared.module';

import { SongsComponent } from '@maheta/songs/songs.component';

@NgModule({
  declarations: [SongsComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SongsComponent,
      },
    ]),
    SharedModule,
  ],
})
export class SongsModule {}
