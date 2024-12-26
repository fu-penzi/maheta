import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Playlist } from '@src/app/db/domain/playlist.schema';
import { Track } from '@src/app/db/domain/track.schema';
import {
  AddToPlaylistDialogComponent,
  AddToPlaylistDialogData,
} from '@src/app/modules/shared/dialog/add-to-playlist-dialog/add-to-playlist-dialog.component';
import { MahetaService } from '@src/app/services/maheta.service';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { MusicLibraryPlaylistsService } from '@src/app/services/music-library/music-library-playlists.service';

@Component({
  selector: 'maheta-track-scroll-view',
  templateUrl: './track-scroll-view.component.html',
  styleUrls: ['./track-scroll-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackScrollViewComponent implements OnChanges {
  @Input() public tracks: Track[];
  @Input() public playlist: Playlist;
  @Input() public currentTrack: Track | null;

  constructor(
    private readonly musicControlService: MusicControlService,
    private readonly musicLibraryPlaylistsService: MusicLibraryPlaylistsService,
    private readonly mahetaService: MahetaService,
    private readonly matDialogService: MatDialog
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['tracks']) {
      this.musicControlService.nextQueue = this.tracks;
    }
  }

  public playPosition(position: number): void {
    this.musicControlService.playPosition(position);
  }

  public isCurrentTrack(track: Track): boolean {
    if (!this.currentTrack) {
      return false;
    }
    return this.currentTrack.uri === track.uri;
  }

  public deleteFromPlaylist(track: Track): void {
    this.musicLibraryPlaylistsService.removeTrackFromPlaylist$(this.playlist, track).subscribe();
  }

  public openAddToPlaylistDialog(track: Track): void {
    const data: AddToPlaylistDialogData = { track };
    this.matDialogService.open(AddToPlaylistDialogComponent, { data, width: '100%' });
  }

  public openEditLyricsDialog(track: Track): void {
    this.mahetaService.openEditLyricsDialog({ track: track });
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
