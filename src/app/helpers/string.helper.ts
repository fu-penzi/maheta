import * as natural from 'natural';

export function getSentences(str: string): string[] {
  return str.split(/\r?\n/).filter((sentence: string) => sentence);
}

export function getWords(str: string): string[] {
  const tokenizer = new natural.RegexpTokenizer({
    pattern: new RegExp('\\s+'),
    discardEmpty: true,
  });

  return tokenizer.tokenize(str);
}

const punctuationMarks: string[] = ['.', ',', ':', '!', '?', '。', `'`, `"`];
export function isPunctuationMark(str: string): boolean {
  return punctuationMarks.includes(str);
}
