import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@src/app/modules/shared/shared.module';

import { PlayerComponent } from '@maheta/player/player.component';

@NgModule({
  //TODO add guard when nothing is playing
  declarations: [PlayerComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PlayerComponent,
      },
    ]),
    SharedModule,
    MatButtonModule,
    MatSliderModule,
    FormsModule,
    MatIconModule,
  ],
})
export class PlayerModule {}
