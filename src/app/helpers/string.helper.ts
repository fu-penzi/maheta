import { LyricLine, Lyrics, mapLyricLinesWords } from '@src/app/db/domain/lyrics';
import {
  containsEnglishRegExp,
  containsJapaneseRegExp,
  lrcFormatLineRegExp,
} from '@src/app/helpers/regex';
import { LanguageEnum } from '@src/app/model/language.enum';

import * as natural from 'natural';

export function splitToLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function getTokenizer(language: LanguageEnum): any {
  let tokenizer;
  switch (language) {
    case LanguageEnum.JAPANESE:
      tokenizer = new natural.TokenizerJa();
      break;
    case LanguageEnum.ENGLISH:
      tokenizer = new natural.RegexpTokenizer({
        pattern: new RegExp('\\s+'),
        discardEmpty: true,
      });
      break;
    default:
      tokenizer = new natural.RegexpTokenizer({
        pattern: new RegExp('\\s+'),
        discardEmpty: true,
      });
  }
  return tokenizer;
}

export function detectLanguage(str: string): LanguageEnum {
  const containsJapaneseMatch: RegExpMatchArray[] = [
    ...str.substring(0, 20).matchAll(containsJapaneseRegExp),
  ];
  if (containsJapaneseMatch.length > 3) {
    return LanguageEnum.JAPANESE;
  }

  return LanguageEnum.ENGLISH;
}

export function isWordEnglish(str: string): boolean {
  return !!str.match(containsEnglishRegExp)?.length;
}

export function getWords(str: string, tokenizer: any): string[] {
  return tokenizer.tokenize(str);
}

export function parseLyrics(text: string): Lyrics {
  const lyricLines: string[] = splitToLines(text || '');

  if (!lyricLines.length) {
    return { isLrcFormat: false, text: '', lines: [] };
  }
  const isLrcFormat: boolean = lyricLines.every((l: string) => l.match(lrcFormatLineRegExp));
  const parsedLines: LyricLine[] = getParsedLines(lyricLines, isLrcFormat);

  return { isLrcFormat: isLrcFormat, lines: mapLyricLinesWords(parsedLines), text };
}

function getParsedLines(lyricLines: string[], isLrcFormat: boolean): LyricLine[] {
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
