import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { LyricLine, Lyrics, mapLyricLinesWords } from '@src/app/db/domain/lyrics';
import { Track } from '@src/app/db/domain/track.schema';
import { lrcFormatLineRegExp } from '@src/app/helpers/regex';
import { splitToLines } from '@src/app/helpers/string.helper';
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
    const lyrics: Lyrics = this.parseLyrics(this.lyrics?.value);
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

  private parseLyrics(text: string): Lyrics {
    const lyricLines: string[] = splitToLines(text || '');

    if (!lyricLines.length) {
      return { isLrcFormat: false, text: '', lines: [] };
    }
    const isLrcFormat: boolean = lyricLines.every((l: string) => l.match(lrcFormatLineRegExp));
    const parsedLines: LyricLine[] = this.getParsedLines(lyricLines, isLrcFormat);

    return { isLrcFormat: isLrcFormat, lines: mapLyricLinesWords(parsedLines), text };
  }

  private getParsedLines(lyricLines: string[], isLrcFormat: boolean): LyricLine[] {
    if (!isLrcFormat) {
      return lyricLines.map((text: string) => ({ time: null, text, words: [] }));
    }

    const parsedLines: LyricLine[] = lyricLines.map((line: string) => {
      const [metadata, text] = line
        .substring(1)
        .split(']')
        .map((s) => s.trim());

      const [minutes, seconds] = metadata.split(':').map((s) => s.trim());
      const time: number = parseFloat(minutes) * 60 + parseFloat(seconds);

      return { time: isNaN(time) ? null : time, words: [], text };
    });

    /* Ignore first few lines with track metadata ([id: Lorem ipsum], [al:Lorem ipsum]...) */
    return parsedLines.filter((lyricLine: LyricLine) => lyricLine.text);
  }
}
