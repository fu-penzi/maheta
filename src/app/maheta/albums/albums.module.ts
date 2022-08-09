import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlbumsComponent } from '@maheta/albums/albums.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@src/app/modules/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AlbumsComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AlbumsComponent,
      },
    ]),
    SharedModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class AlbumsModule {}
