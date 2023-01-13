import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@environment/environment';

import { Playlist } from '@src/app/db/domain/playlist.schema';
import { Track } from '@src/app/db/domain/track.schema';
import { MusicLibraryPlaylistsService } from '@src/app/services/music-library/music-library-playlists.service';

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
    private musicLibraryPlaylistsService: MusicLibraryPlaylistsService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: AddToPlaylistDialogData
  ) {}

  public get track(): Track {
    return this.data.track;
  }

  public get playlists(): Playlist[] {
    return this.musicLibraryPlaylistsService.playlists;
  }

  public addTrackToPlaylist(playlist: Playlist, track: Track): void {
    if (playlist.tracks.includes(track.uri)) {
      this.openSnackBar(
        environment.locales.MAHETA.ADD_TO_PLAYLIST_DIALOG.message(track.title, playlist.name),
        environment.locales.MAHETA.ADD_TO_PLAYLIST_DIALOG.action
      );
      return;
    }
    this.musicLibraryPlaylistsService
      .addTrackToPlaylist$(playlist, track)
      .subscribe(() => this.close());
  }

  public openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 1500 });
  }

  public close(): void {
    this.dialogRef.close();
  }
}
