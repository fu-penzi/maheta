import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { LyricLine, Lyrics, mapLyricLinesWords } from '@src/app/db/domain/lyrics';
import { Track } from '@src/app/db/domain/track';
import { lrcFormatLineRegExp } from '@src/app/helpers/regex';
import { parseLyrics, splitToLines } from '@src/app/helpers/string.helper';
import { MusicLibraryTracksService } from '@src/app/services/music-library/music-library-tracks.service';

import { Subject } from 'rxjs';

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
  public save$: Subject<Track> = new Subject();
  public close$: Subject<void> = new Subject();

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
    const lyrics: Lyrics = parseLyrics(this.lyrics?.value);
    this.musicLibraryTracksService.addLyricsToTrack$(this.track, lyrics);
    this.save$.next({ ...this.track, lyrics });
    this.save$.complete();
    this.close();
  }

  public close(): void {
    this.close$.next();
    this.close$.complete();
    this.dialogRef.close();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      lyrics: [this.track.lyrics?.text],
    });
  }
}
