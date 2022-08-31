import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Track } from '@src/app/db/domain/track.schema';
import { MusicLibraryService } from '@src/app/services/music-library.service';

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
    private musicLibraryService: MusicLibraryService,
    @Inject(MAT_DIALOG_DATA) public data: EditLyricsDialogData
  ) {}

  public ngOnInit(): void {
    this.buildForm();
  }

  public get track(): Track {
    return this.data.track;
  }

  public save(): void {
    this.musicLibraryService
      .addLyricsToTrack$(this.track, this.lyrics?.value)
      .subscribe(() => this.close());
  }

  public close(): void {
    this.dialogRef.close();
  }

  private get lyrics(): AbstractControl {
    return this.form.get('lyrics') as AbstractControl;
  }

  private buildForm(): void {
    this.form = this.fb.group({
      lyrics: [this.track.lyrics],
    });
  }
}
