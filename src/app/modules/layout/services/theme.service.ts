import { Injectable } from '@angular/core';

export enum ThemeClassEnum {
  light = 'light-theme',
  dark = 'dark-theme',
}

@Injectable()
export class ThemeService {
  private _theme: ThemeClassEnum = ThemeClassEnum.light;

  public get theme(): ThemeClassEnum {
    return this._theme;
  }

  public switchTheme(): void {
    this._theme = this._theme === ThemeClassEnum.dark ? ThemeClassEnum.light : ThemeClassEnum.dark;
  }
}
