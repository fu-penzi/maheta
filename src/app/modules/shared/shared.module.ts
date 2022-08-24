import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

import { AddToPlaylistDialogComponent } from '@src/app/modules/shared/add-to-playlist-dialog/add-to-playlist-dialog.component';
import { PlaylistScrollViewComponent } from '@src/app/modules/shared/playlist-scroll-view/playlist-scroll-view.component';
import { TrackScrollViewComponent } from '@src/app/modules/shared/track-scroll-view/track-scroll-view.component';
import { DurationPipe } from '@src/app/pipes/duration.pipe';

@NgModule({
  declarations: [
    TrackScrollViewComponent,
    PlaylistScrollViewComponent,
    DurationPipe,
    AddToPlaylistDialogComponent,
  ],
  imports: [
    CommonModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    ScrollingModule,
    RouterModule,
    MatMenuModule,
    MatDialogModule,
  ],
  exports: [
    CommonModule,
    TrackScrollViewComponent,
    PlaylistScrollViewComponent,
    DurationPipe,
    AddToPlaylistDialogComponent,
  ],
})
export class SharedModule {}
