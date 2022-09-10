import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

import { AddToPlaylistDialogComponent } from '@src/app/modules/shared/dialog/add-to-playlist-dialog/add-to-playlist-dialog.component';
import { CreatePlaylistDialogComponent } from '@src/app/modules/shared/dialog/create-playlist-dialog/create-playlist-dialog.component';
import { EditLyricsDialogComponent } from '@src/app/modules/shared/dialog/edit-lyrics-dialog/edit-lyrics-dialog.component';
import { PlaylistScrollViewComponent } from '@src/app/modules/shared/playlist-scroll-view/playlist-scroll-view.component';
import { TrackScrollViewComponent } from '@src/app/modules/shared/track-scroll-view/track-scroll-view.component';
import { DurationPipe } from '@src/app/pipes/duration.pipe';

const exportedModules = [
  CommonModule,
  TrackScrollViewComponent,
  PlaylistScrollViewComponent,
  DurationPipe,
];
const exportedComponents = [TrackScrollViewComponent, PlaylistScrollViewComponent, DurationPipe];

@NgModule({
  declarations: [
    TrackScrollViewComponent,
    PlaylistScrollViewComponent,
    DurationPipe,
    AddToPlaylistDialogComponent,
    CreatePlaylistDialogComponent,
    EditLyricsDialogComponent,
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
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: [...exportedModules, ...exportedComponents],
})
export class SharedModule {}
