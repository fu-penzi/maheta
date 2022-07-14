import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PlayerComponent } from './player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

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
    MatSliderModule,
    FormsModule,
    MatIconModule,
  ],
})
export class PlayerModule {}
