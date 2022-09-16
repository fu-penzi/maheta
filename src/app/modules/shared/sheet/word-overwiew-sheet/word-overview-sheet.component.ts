import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { TranslatorService, WordLookupDto } from '@src/app/api';

import { delay } from 'rxjs';

export interface WordOverviewSheetData {
  word: string;
}
@Component({
  selector: 'maheta-word-overview-sheet',
  templateUrl: './word-overview-sheet.component.html',
  styleUrls: ['./word-overview-sheet.component.scss'],
})
export class WordOverviewSheetComponent implements OnInit {
  public wordLookupDto: WordLookupDto;

  constructor(
    private httpClient: HttpClient,
    public translatorService: TranslatorService,
    private bottomSheetRef: MatBottomSheetRef<WordOverviewSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: WordOverviewSheetData
  ) {}

  public get word(): string {
    return this.data.word;
  }

  public ngOnInit(): void {
    this.translatorService
      .getWordLookup(this.word)
      .pipe(delay(2000))
      .subscribe((wordLookupDto: WordLookupDto) => (this.wordLookupDto = wordLookupDto));
  }

  public close(): void {
    this.bottomSheetRef.dismiss();
  }
}
