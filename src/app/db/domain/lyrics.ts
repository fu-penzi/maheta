import {
  detectLanguage,
  getTokenizer,
  getWords,
  isWordEnglish,
} from '@src/app/helpers/string.helper';
import { LanguageEnum } from '@src/app/model/language.enum';

export interface Lyrics {
  isLrcFormat: boolean;
  text: string;
  lines: LyricLine[];
}

export interface LyricLine {
  text: string;
  words: Word[];
  time: number | null;
}

export interface Word {
  text: string;
  showWhitespace?: boolean;
}

export function mapLyricLinesWords(lyricLines: LyricLine[]): LyricLine[] {
  const language: LanguageEnum = detectLanguage(lyricLines[0].text || '');
  const tokenizer = getTokenizer(language);

  return lyricLines.map((line: LyricLine) => ({
    ...line,
    words: getWords(line.text || '', tokenizer)?.map((word: string) => ({
      text: word,
      showWhitespace: isWordEnglish(word),
    })),
  }));
}
