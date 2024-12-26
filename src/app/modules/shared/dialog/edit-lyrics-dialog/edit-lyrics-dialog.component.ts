import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Track } from '@src/app/db/domain/track.schema';
import { MusicLibraryTracksService } from '@src/app/services/music-library/music-library-tracks.service';

export interface EditLyricsDialogData {
  track: Track;
}

@Component({
  selector: 'maheta-edit-lyrics-dialog',
  templateUrl: './edit-lyrics-dialog.component.html',
  styleUrls: ['./edit-lyrics-dialog.component.scss'],
})
export class EditLyricsDialogComponent implements OnInit {
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditLyricsDialogComponent>,
    private musicLibraryTracksService: MusicLibraryTracksService,
    @Inject(MAT_DIALOG_DATA) public data: EditLyricsDialogData
  ) {}

  public get track(): Track {
    return this.data.track;
  }

  private get lyrics(): AbstractControl {
    return this.form.get('lyrics') as AbstractControl;
  }

  public ngOnInit(): void {
    this.buildForm();
  }

  public clearInput(): void {
    this.form.get('lyrics')?.setValue('');
  }

  public save(): void {
    this.musicLibraryTracksService.addLyricsToTrack$(this.track, this.lyrics?.value);
    this.close();
  }

  public close(): void {
    this.dialogRef.close();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      lyrics: [this.track.lyrics],
    });
  }
}
