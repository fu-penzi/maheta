import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PlayerComponent } from './player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FileLoadingService } from '@app/services/file-loading.service';

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
