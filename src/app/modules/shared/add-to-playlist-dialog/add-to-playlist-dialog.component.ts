import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DatabaseService } from '@src/app/db/database.service';
import { Playlist } from '@src/app/db/domain/playlist.schema';
import { Track } from '@src/app/db/domain/track.schema';
import { MusicLibraryService } from '@src/app/services/music-library.service';

export interface AddToPlaylistDialogData {
  track: Track;
}

@Component({
  selector: 'maheta-add-to-playlist-dialog',
  templateUrl: './add-to-playlist-dialog.component.html',
  styleUrls: ['./add-to-playlist-dialog.component.scss'],
})
export class AddToPlaylistDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<AddToPlaylistDialogComponent>,
    private musicLibraryService: MusicLibraryService,
    @Inject(MAT_DIALOG_DATA) public data: AddToPlaylistDialogData
  ) {}

  public get track(): Track {
    return this.data.track;
  }

  public get playlists(): Playlist[] {
    return this.musicLibraryService.playlists;
  }

  public addTrackToPlaylist(playlist: Playlist, track: Track): void {
    this.musicLibraryService.addTrackToPlaylist$(playlist, track).subscribe(() => this.close());
  }

  public close(): void {
    this.dialogRef.close();
  }
}
