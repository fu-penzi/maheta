import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { MusicLibraryPlaylistsService } from '@src/app/services/music-library/music-library-playlists.service';

@Component({
  selector: 'maheta-create-playlist-dialog',
  templateUrl: './create-playlist-dialog.component.html',
  styleUrls: ['./create-playlist-dialog.component.scss'],
})
export class CreatePlaylistDialogComponent implements OnInit {
  public form: FormGroup;

  constructor(
    private musicLibraryPlaylistsService: MusicLibraryPlaylistsService,
    private dialogRef: MatDialogRef<CreatePlaylistDialogComponent>,
    private fb: FormBuilder
  ) {}

  private get playlistName(): AbstractControl {
    return this.form.get('playlistName') as AbstractControl;
  }

  public ngOnInit(): void {
    this.buildForm();
  }

  public save(): void {
    this.musicLibraryPlaylistsService.createPlaylist(this.playlistName?.value);
    this.close();
  }

  public close(): void {
    this.dialogRef.close();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      playlistName: [''],
    });
  }
}
