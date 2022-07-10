import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PlayerComponent } from './player.component';

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
  ],
})
export class PlayerModule {}
