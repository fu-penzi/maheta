import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Browser } from '@capacitor/browser';

import { LyricLine, Lyrics, Word } from '@src/app/db/domain/lyrics';
import { Track } from '@src/app/db/domain/track';
import { EditLyricsDialogComponent } from '@src/app/modules/shared/dialog/edit-lyrics-dialog/edit-lyrics-dialog.component';
import { MahetaDialogService } from '@src/app/services/maheta-dialog.service';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { MusicLibraryTracksService } from '@src/app/services/music-library/music-library-tracks.service';

import { take, takeUntil, throttleTime } from 'rxjs';

@Component({
  selector: 'maheta-player-lyrics',
  templateUrl: './player-lyrics.component.html',
  styleUrls: ['./player-lyrics.component.scss'],
})
export class PlayerLyricsComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('lyricsViewport') lyricsViewport: ElementRef;
  @Input() track: Track;

  public highlightedWordText: string = '';
  public currentTrackTime: number = 0;
  public activeLineIndex: number = 0;

  private _currentScrolledToIdx: number = 0;

  constructor(
    private musicControlService: MusicControlService,
    private musicLibraryTracksService: MusicLibraryTracksService,
    private mahetaDialogService: MahetaDialogService
  ) {
    Browser.addListener('browserFinished', () => this.openEditLyricsDialog());
  }

  public get lines(): LyricLine[] {
    return this.track?.lyrics?.lines || [];
  }

  public ngOnInit(): void {
    this.musicControlService.currentTrackAudioTime$
      .pipe(throttleTime(300))
      .subscribe((currentTrackTime: number) => {
        this.currentTrackTime = currentTrackTime;
        if (!this.track.lyrics?.isLrcFormat) {
          this.activeLineIndex = -1;
          return;
        }

        const indexOfNext: number = this.lines.findIndex(
          (lyricLine: LyricLine) => (lyricLine.time || 0) > this.currentTrackTime
        );
        if (indexOfNext === -1) {
          this.activeLineIndex = this.lines.length - 1;
        } else {
          this.activeLineIndex = indexOfNext === 0 ? indexOfNext : indexOfNext - 1;
        }

        const offsetY: number =
          document.getElementById(`sentence_${this.activeLineIndex}`)?.offsetTop || 0;

        if (offsetY > 0 && this._currentScrolledToIdx !== this.activeLineIndex) {
          const offsetDiff = Math.abs(
            offsetY - (this.lyricsViewport?.nativeElement?.scrollTop || 0)
          );
          this.lyricsViewport?.nativeElement?.scrollTo({
            top: offsetY - 90,
            left: 0,
            behavior: offsetDiff < 500 ? 'smooth' : 'auto',
          });
          this._currentScrolledToIdx = this.activeLineIndex;
        }
      });
  }

  public ngOnChanges(): void {
    this.track.lyrics = this.getLyrics();
  }

  public ngOnDestroy(): void {
    Browser.removeAllListeners();
  }

  public wordSelect(wordText: string | undefined): void {
    if (!wordText) {
      return;
    }
    this.highlightedWordText = wordText;
    this.openWordOverviewSheet(wordText.trim());
  }

  public wordUnselect(): void {
    this.highlightedWordText = '';
  }

  public isWordHighlighted(word: string | undefined): boolean {
    return !!word && word === this.highlightedWordText;
  }

  public padWord(word: Word, firstInSentence: boolean): string {
    if (!word.showWhitespace) {
      return word.text;
    }
    return firstInSentence ? `${word.text} ` : ` ${word.text} `;
  }

  public openLyricsBrowser(): void {
    const author: string = this.track?.author || '';
    const title: string = this.track?.title || '';

    Browser.open({
      url: `https://www.lyricsify.com/search?q=${author}+${title}`.replace(/\s+/g, '+'),
    });
  }

  public openEditLyricsDialog(): void {
    const dialogRef: MatDialogRef<EditLyricsDialogComponent> =
      this.mahetaDialogService.openEditLyricsDialog({ track: this.track });

    dialogRef.componentInstance.save$
      .pipe(take(1), takeUntil(dialogRef.componentInstance.close$))
      .subscribe((track: Track) => {
        this.track.lyrics = track.lyrics;
      });
  }

  private openWordOverviewSheet(word: string): void {
    this.mahetaDialogService
      .openWordOverviewSheet({ word })
      .afterClosed()
      .subscribe(() => this.wordUnselect());
  }

  private getLyrics(): Lyrics | undefined {
    return (
      this.musicLibraryTracksService.tracks.find(
        (track) => track?.uri === this.musicControlService.currentTrack?.uri
      ) || this.musicControlService.currentTrack
    )?.lyrics;
  }
}
