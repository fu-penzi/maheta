import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Track } from '@src/app/db/domain/track.schema';
import {
  AddToPlaylistDialogComponent,
  AddToPlaylistDialogData,
} from '@src/app/modules/shared/dialog/add-to-playlist-dialog/add-to-playlist-dialog.component';
import {
  EditLyricsDialogComponent,
  EditLyricsDialogData,
} from '@src/app/modules/shared/dialog/edit-lyrics-dialog/edit-lyrics-dialog.component';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { Playlist } from '@src/app/db/domain/playlist.schema';
import { MusicLibraryService } from '@src/app/services/music-library.service';

@Component({
  selector: 'maheta-track-scroll-view',
  templateUrl: './track-scroll-view.component.html',
  styleUrls: ['./track-scroll-view.component.scss'],
})
export class TrackScrollViewComponent implements OnInit {
  @Input() public tracks: Track[];
  @Input() public playlist: Playlist;

  constructor(
    private readonly musicControlService: MusicControlService,
    private readonly musicLibraryService: MusicLibraryService,
    public matDialogService: MatDialog
  ) {}

  public get currentTrack(): Track {
    return this.musicControlService.currentTrack;
  }

  public ngOnInit(): void {
    this.musicControlService.nextQueue = this.tracks;
  }

  public playPosition(position: number): void {
    this.musicControlService.playPosition(position);
  }

  public trackByIndex(index: number): number {
    return index;
  }

  public isCurrentTrack(track: Track): boolean {
    if (!this.currentTrack) {
      return false;
    }
    return this.currentTrack.uri === track.uri;
  }

  public deleteFromPlaylist(track: Track): void {
    this.musicLibraryService.removeTrackFromPlaylist$(this.playlist, track).subscribe();
  }

  public openAddToPlaylistDialog(track: Track): void {
    const data: AddToPlaylistDialogData = {
      track,
    };
    this.matDialogService.open(AddToPlaylistDialogComponent, { data, width: '100%' });
  }

  public openEditLyricsDialog(track: Track): void {
    const data: EditLyricsDialogData = {
      track,
    };
    this.matDialogService.open(EditLyricsDialogComponent, { data, width: '100%' });
  }
}
