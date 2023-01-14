import { Injectable } from '@angular/core';

import { LocalStorageEnum } from '@src/app/model/localStorage.enum';

import { TranslateService } from '@ngx-translate/core';

export enum AppLanguageCodeEnum {
  ENGLISH = 'en',
  POLISH = 'pl',
}

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  public readonly defaultLanguage: AppLanguageCodeEnum = AppLanguageCodeEnum.ENGLISH;
  public language: AppLanguageCodeEnum = AppLanguageCodeEnum.ENGLISH;

  constructor(public translate: TranslateService) {}

  public init(): void {
    const language: AppLanguageCodeEnum = localStorage.getItem(
      LocalStorageEnum.language
    ) as AppLanguageCodeEnum;
    this.language = language || this.language;
    this.translate.setDefaultLang(this.defaultLanguage);
    this.translate.use(this.language);
  }

  public setLanguage(language: AppLanguageCodeEnum): void {
    this.language = language;
    this.translate.use(this.language);
    localStorage.setItem(LocalStorageEnum.language, language);
    window.location.reload();
  }
}
