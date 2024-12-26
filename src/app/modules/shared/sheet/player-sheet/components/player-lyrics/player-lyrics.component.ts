import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Browser } from '@capacitor/browser';

import { Track } from '@src/app/db/domain/track.schema';
import {
  detectLanguage,
  getSentences,
  getTokenizer,
  getWords,
} from '@src/app/helpers/string.helper';
import { LanguageEnum } from '@src/app/model/language.enum';
import {
  WordOverviewComponent,
  WordOverviewSheetData,
} from '@src/app/modules/shared/sheet/word-overwiew-sheet/word-overview.component';
import { MahetaService } from '@src/app/services/maheta.service';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { MusicLibraryTracksService } from '@src/app/services/music-library/music-library-tracks.service';

interface LyricSentence {
  words: string[];
}

@Component({
  selector: 'maheta-player-lyrics',
  templateUrl: './player-lyrics.component.html',
  styleUrls: ['./player-lyrics.component.scss'],
})
export class PlayerLyricsComponent implements OnChanges, OnDestroy {
  @Input() track: Track;

  public lyricSentences: LyricSentence[] = [];
  public highlightedWord: string = '';

  private _language: LanguageEnum;

  constructor(
    private musicControlService: MusicControlService,
    private musicLibraryTracksService: MusicLibraryTracksService,
    private mahetaService: MahetaService,
    private matDialogService: MatDialog
  ) {
    Browser.addListener('browserFinished', () => {
      this.openEditLyricsDialog();
    });
  }

  private get lyrics(): string | undefined {
    return (
      this.musicLibraryTracksService.tracks.find(
        (track) => track?.uri === this.musicControlService.currentTrack?.uri
      ) || this.musicControlService.currentTrack
    )?.lyrics;
  }

  public ngOnChanges(): void {
    this.setupLyrics();
  }

  public ngOnDestroy(): void {
    Browser.removeAllListeners();
  }

  public wordSelect(word: string | undefined): void {
    if (!word) {
      return;
    }
    this.highlightedWord = word;
    this.openWordOverviewSheet(word.trim());
  }

  public wordUnselect(): void {
    this.highlightedWord = '';
  }

  public isWordHighlighted(word: string | undefined): boolean {
    return !!word && word === this.highlightedWord;
  }

  public openLyricsBrowser(): void {
    const author: string = this.track?.author || '';
    const title: string = this.track?.title || '';

    Browser.open({
      url: `https://www.lyricsify.com/search?q=${author}+${title}`.replace(/\s+/g, '+'),
    });
  }

  public openEditLyricsDialog(): void {
    this.mahetaService.openEditLyricsDialog({ track: this.track });
  }

  private openWordOverviewSheet(word: string): void {
    const wordOverviewSheetData: WordOverviewSheetData = { word };
    const dialogOptions = {
      panelClass: 'word-overview-sheet-panel',
      data: wordOverviewSheetData,
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      position: { left: '0', bottom: '0' },
    };

    this.matDialogService
      .open(WordOverviewComponent, dialogOptions)
      .afterClosed()
      .subscribe(() => {
        this.wordUnselect();
      });
  }

  private setupLyrics(): void {
    if (!this.lyrics) {
      this.lyricSentences = [];
      return;
    }

    this._language = detectLanguage(this.lyrics);

    const tokenizer = getTokenizer(this._language);
    this.lyricSentences = getSentences(this.lyrics).map((sentence: string) => ({
      words: getWords(sentence, tokenizer),
    }));
  }
}
