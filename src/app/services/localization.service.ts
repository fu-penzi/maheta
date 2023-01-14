import { Injectable } from '@angular/core';

import { LocalStorageEnum } from '@src/app/model/localStorage.enum';

import { TranslateService } from '@ngx-translate/core';

export enum AppLanguageCodeEnum {
  ENGLISH = 'en',
  POLISH = 'pl',
}

export interface AppLanguage {
  code: AppLanguageCodeEnum;
  name: string;
}

const appLanguages: {
  [key in AppLanguageCodeEnum]: AppLanguage;
} = {
  [AppLanguageCodeEnum.ENGLISH]: {
    code: AppLanguageCodeEnum.ENGLISH,
    name: 'English',
  },
  [AppLanguageCodeEnum.POLISH]: {
    code: AppLanguageCodeEnum.POLISH,
    name: 'Polish',
  },
};

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  public readonly defaultLanguage: AppLanguage = appLanguages[AppLanguageCodeEnum.ENGLISH];
  public language: AppLanguage = appLanguages[AppLanguageCodeEnum.ENGLISH];

  constructor(public translate: TranslateService) {}

  public get languages(): AppLanguage[] {
    return Object.values(appLanguages);
  }

  public init(): void {
    const language: AppLanguageCodeEnum = localStorage.getItem(
      LocalStorageEnum.language
    ) as AppLanguageCodeEnum;
    this.language = appLanguages[language] || this.language;
    this.translate.setDefaultLang(this.defaultLanguage.code);
    this.translate.use(this.language.code);
  }

  public setLanguage(language: AppLanguageCodeEnum): void {
    this.language = appLanguages[language];
    this.translate.use(language);
    localStorage.setItem(LocalStorageEnum.language, language);
    window.location.reload();
  }
}
