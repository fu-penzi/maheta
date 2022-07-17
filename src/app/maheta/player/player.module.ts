import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { RouterModule } from '@angular/router';

import { FileLoadingService } from '@src/app/services/file-loading.service';

import { PlayerComponent } from '@maheta/player/player.component';

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
  providers: [FileLoadingService],
})
export class PlayerModule {}
