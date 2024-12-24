import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface WordOverviewSheetData {
  word: string;
}

@Component({
  selector: 'maheta-word-overview',
  templateUrl: './word-overview.component.html',
  styleUrls: ['./word-overview.component.scss'],
})
export class WordOverviewComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: WordOverviewSheetData) {}

  public get word(): string {
    return this.data.word;
  }
}
