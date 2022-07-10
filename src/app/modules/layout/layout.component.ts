import { Component } from '@angular/core';

const themes = {
  light: 'light-theme',
  dark: 'dark-theme',
};

@Component({
  selector: 'maheta-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  isDark: boolean = true;
  theme: string = themes.dark;

  constructor() {}

  switchTheme() {
    this.isDark = !this.isDark;
    this.theme = this.isDark ? themes.dark : themes.light;
  }
}
