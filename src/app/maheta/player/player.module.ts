import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PlayerComponent } from './player.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [PlayerComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PlayerComponent,
      },
    ]),
    CommonModule,
    MatButtonModule,
  ],
})
export class PlayerModule {}
