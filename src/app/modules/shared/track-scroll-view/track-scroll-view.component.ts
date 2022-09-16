import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Playlist } from '@src/app/db/domain/playlist.schema';
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
import { MusicLibraryPlaylistsService } from '@src/app/services/music-library/music-library-playlists.service';
import { logger } from '@src/devUtils';

@Component({
  selector: 'maheta-track-scroll-view',
  templateUrl: './track-scroll-view.component.html',
  styleUrls: ['./track-scroll-view.component.scss'],
})
export class TrackScrollViewComponent implements OnInit {
  @Input() public tracks: Track[];
  @Input() public playlist: Playlist;

  public currentTrack: Track;

  constructor(
    private readonly musicControlService: MusicControlService,
    private readonly musicLibraryPlaylistsService: MusicLibraryPlaylistsService,
    public matDialogService: MatDialog
  ) {}

  public ngOnInit(): void {
    this.musicControlService.nextQueue = this.tracks;
    this.musicControlService.currentTrack$.subscribe((track: Track) => (this.currentTrack = track));
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
    this.musicLibraryPlaylistsService.removeTrackFromPlaylist$(this.playlist, track).subscribe();
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
