import { Component, Input, OnChanges } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { Track } from '@src/app/db/domain/track.schema';
import {
  detectLanguage,
  getSentences,
  getTokenizer,
  getWords,
} from '@src/app/helpers/string.helper';
import {
  WordOverviewSheetComponent,
  WordOverviewSheetData,
} from '@src/app/modules/shared/sheet/word-overwiew-sheet/word-overview-sheet.component';
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
export class PlayerLyricsComponent implements OnChanges {
  @Input() track: Track;

  public lyricSentences: LyricSentence[] = [];
  public highlightedWord: string = '';

  constructor(
    private musicControlService: MusicControlService,
    private musicLibraryTracksService: MusicLibraryTracksService,
    private bottomSheet: MatBottomSheet
  ) {}

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

  public wordSelect(word: string | undefined): void {
    if (!word) {
      return;
    }
    this.highlightedWord = word;
    this.openWordOverviewSheet(word.trim());
  }

  public isWordHighlighted(word: string | undefined): boolean {
    return !!word && word === this.highlightedWord;
  }

  private openWordOverviewSheet(word: string): void {
    const wordOverviewSheetData: WordOverviewSheetData = { word };
    this.bottomSheet.open(WordOverviewSheetComponent, {
      data: wordOverviewSheetData,
    });
  }

  private setupLyrics(): void {
    if (!this.lyrics) {
      this.lyricSentences = [];
      return;
    }

    const tokenizer = getTokenizer(detectLanguage(this.lyrics));
    this.lyricSentences = getSentences(this.lyrics).map((sentence: string) => ({
      words: getWords(sentence, tokenizer),
    }));
  }
}
