import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@src/app/modules/shared/shared.module';

import { SongsComponent } from '@maheta/songs/songs.component';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SongsComponent],
  imports: [
    TranslateModule,
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
