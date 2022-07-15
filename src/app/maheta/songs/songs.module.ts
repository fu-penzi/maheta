import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SongsComponent } from './songs.component';
import { MatRippleModule } from '@angular/material/core';

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
