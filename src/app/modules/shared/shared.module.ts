import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { SetClassAfterViewInitDirective } from '@src/app/directives/set-class-after-view-init.directive';
import { AddToPlaylistDialogComponent } from '@src/app/modules/shared/dialog/add-to-playlist-dialog/add-to-playlist-dialog.component';
import { DialogFooterButtonsComponent } from '@src/app/modules/shared/dialog/components/dialog-footer-buttons/dialog-footer-buttons.component';
import { CreatePlaylistDialogComponent } from '@src/app/modules/shared/dialog/create-playlist-dialog/create-playlist-dialog.component';
import { EditLyricsDialogComponent } from '@src/app/modules/shared/dialog/edit-lyrics-dialog/edit-lyrics-dialog.component';
import { EditStorageSettingsDialogComponent } from '@src/app/modules/shared/dialog/edit-storage-settings-dialog/edit-storage-settings-dialog.component';
import { LoadingDialogComponent } from '@src/app/modules/shared/dialog/loading-dialog/loading-dialog.component';
import { InfoTextComponent } from '@src/app/modules/shared/info-text/info-text.component';
import { PlaylistScrollViewComponent } from '@src/app/modules/shared/playlist-scroll-view/playlist-scroll-view.component';
import { PlayerControlsComponent } from '@src/app/modules/shared/sheet/player-sheet/components/player-controls/player-controls.component';
import { PlayerLyricsComponent } from '@src/app/modules/shared/sheet/player-sheet/components/player-lyrics/player-lyrics.component';
import { PlayerSwiperComponent } from '@src/app/modules/shared/sheet/player-sheet/components/player-swiper/player-swiper.component';
import { PlayerSheetComponent } from '@src/app/modules/shared/sheet/player-sheet/player-sheet.component';
import { WordOverviewComponent } from '@src/app/modules/shared/sheet/word-overwiew-sheet/word-overview.component';
import { TrackScrollViewComponent } from '@src/app/modules/shared/track-scroll-view/track-scroll-view.component';
import { DurationPipe } from '@src/app/pipes/duration.pipe';
import { SafePipe } from '@src/app/pipes/safe-pipe.pipe';

import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Virtual } from 'swiper';

SwiperCore.use([Virtual]);

const exportedComponents = [
  TrackScrollViewComponent,
  PlaylistScrollViewComponent,
  DurationPipe,
  SafePipe,
  SetClassAfterViewInitDirective,
  InfoTextComponent,
];

@NgModule({
  declarations: [
    ...exportedComponents,
    PlayerControlsComponent,
    PlayerLyricsComponent,
    PlayerSheetComponent,
    WordOverviewComponent,
    AddToPlaylistDialogComponent,
    CreatePlaylistDialogComponent,
    EditLyricsDialogComponent,
    LoadingDialogComponent,
    EditStorageSettingsDialogComponent,
    DialogFooterButtonsComponent,
    PlayerSwiperComponent,
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
    MatSliderModule,
    FormsModule,
    MatDividerModule,
    SwiperModule,
    MatCardModule,
    NgOptimizedImage,
  ],
  exports: [...exportedComponents, CommonModule, TranslateModule],
})
export class SharedModule {}
