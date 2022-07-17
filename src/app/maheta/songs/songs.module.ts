import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

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
    CommonModule,
    MatRippleModule,
  ],
})
export class SongsModule {}
