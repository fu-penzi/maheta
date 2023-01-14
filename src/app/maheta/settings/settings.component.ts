import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { AppLanguageCodeEnum, LocalizationService } from '@src/app/services/localization.service';

@Component({
  selector: 'maheta-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public form: FormGroup;
  public readonly languageCodes: AppLanguageCodeEnum[] = Object.values(AppLanguageCodeEnum);

  constructor(private localizationService: LocalizationService, private fb: FormBuilder) {}

  public get displayForm(): FormGroup {
    return this.form?.get('display') as FormGroup;
  }

  public get languageControl(): AbstractControl {
    return this.displayForm?.get('language') as AbstractControl;
  }

  public ngOnInit(): void {
    this.buildForm();
    this.languageControl?.valueChanges.subscribe((languageCode: AppLanguageCodeEnum) =>
      this.localizationService.setLanguage(languageCode)
    );
  }

  private buildForm(): void {
    this.form = this.fb.group({
      display: this.fb.group({
        language: [this.localizationService.language],
      }),
    });
  }
}
