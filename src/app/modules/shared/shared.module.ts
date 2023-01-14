import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { AddToPlaylistDialogComponent } from '@src/app/modules/shared/dialog/add-to-playlist-dialog/add-to-playlist-dialog.component';
import { DialogFooterButtonsComponent } from '@src/app/modules/shared/dialog/components/dialog-footer-buttons/dialog-footer-buttons.component';
import { CreatePlaylistDialogComponent } from '@src/app/modules/shared/dialog/create-playlist-dialog/create-playlist-dialog.component';
import { EditLyricsDialogComponent } from '@src/app/modules/shared/dialog/edit-lyrics-dialog/edit-lyrics-dialog.component';
import { EditStorageSettingsDialogComponent } from '@src/app/modules/shared/dialog/edit-storage-settings-dialog/edit-storage-settings-dialog.component';
import { LoadingDialogComponent } from '@src/app/modules/shared/dialog/loading-dialog/loading-dialog.component';
import { PlaylistScrollViewComponent } from '@src/app/modules/shared/playlist-scroll-view/playlist-scroll-view.component';
import { WordOverviewSheetComponent } from '@src/app/modules/shared/sheet/word-overwiew-sheet/word-overview-sheet.component';
import { TrackScrollViewComponent } from '@src/app/modules/shared/track-scroll-view/track-scroll-view.component';
import { DurationPipe } from '@src/app/pipes/duration.pipe';
import { SafePipe } from '@src/app/pipes/safe-pipe.pipe';

import { TranslateModule } from '@ngx-translate/core';

const exportedModules = [
  CommonModule,
  TrackScrollViewComponent,
  PlaylistScrollViewComponent,
  DurationPipe,
];
const exportedComponents = [TrackScrollViewComponent, PlaylistScrollViewComponent, DurationPipe];

@NgModule({
  declarations: [
    WordOverviewSheetComponent,
    TrackScrollViewComponent,
    PlaylistScrollViewComponent,
    DurationPipe,
    SafePipe,
    AddToPlaylistDialogComponent,
    CreatePlaylistDialogComponent,
    EditLyricsDialogComponent,
    LoadingDialogComponent,
    EditStorageSettingsDialogComponent,
    DialogFooterButtonsComponent,
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    ScrollingModule,
    MatBottomSheetModule,
    RouterModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatChipsModule,
    TranslateModule,
  ],
  exports: [...exportedModules, ...exportedComponents, SafePipe, TranslateModule],
})
export class SharedModule {}
