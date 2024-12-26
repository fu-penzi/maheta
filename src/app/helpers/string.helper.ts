import { containsEnglishRegExp, containsJapaneseRegExp } from '@src/app/helpers/regex';
import { LanguageEnum } from '@src/app/model/language.enum';

import * as natural from 'natural';

export function getSentences(str: string): string[] {
  return str.split(/\r?\n/).filter((sentence: string) => sentence);
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
