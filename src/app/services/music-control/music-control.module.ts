import { NgModule } from '@angular/core';

import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { QueueService } from '@src/app/services/queue.service';

@NgModule({
  providers: [MusicControlService, QueueService],
})
export class MusicControlModule {}
