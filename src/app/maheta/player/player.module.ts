import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@src/app/modules/shared/shared.module';

import { PlayerControlsComponent } from '@maheta/player/components/player-controls/player-controls.component';
import { PlayerLyricsComponent } from '@maheta/player/components/player-lyrics/player-lyrics.component';
import { PlayerComponent } from '@maheta/player/player.component';

@NgModule({
  //TODO add guard when nothing is playing
  declarations: [PlayerComponent, PlayerControlsComponent, PlayerLyricsComponent],
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
    MatDividerModule,
  ],
})
export class PlayerModule {}
