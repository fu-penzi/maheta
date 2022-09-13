import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LocalStorageEnum } from '@src/app/model/localStorage.enum';
import { ReadOptionsLocalStorage } from '@src/app/model/read-options-local.storage';
import { MahetaService } from '@src/app/services/maheta.service';
import { MusicLibraryTracksService } from '@src/app/services/music-library/music-library-tracks.service';

import { isArray } from 'lodash';

@Component({
  selector: 'maheta-edit-storage-settings-dialog',
  templateUrl: './edit-storage-settings-dialog.component.html',
  styleUrls: ['./edit-storage-settings-dialog.component.scss'],
})
export class EditStorageSettingsDialogComponent implements OnInit {
  public form: FormGroup;

  constructor(
    private mahetaService: MahetaService,
    private dialogRef: MatDialogRef<EditStorageSettingsDialogComponent>,
    private musicLibraryTracksService: MusicLibraryTracksService,
    private matDialogService: MatDialog,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.buildForm();
  }

  public get readOptionsPaths(): AbstractControl[] {
    return (this.form.get('readOptionsPaths') as FormArray)?.controls;
  }

  public save(): void {
    const readOptionsArray = this.readOptionsPaths
      .filter((control: AbstractControl) => control?.value)
      .map((control: AbstractControl) => ({
        path: control?.value,
      }));
    localStorage.setItem(LocalStorageEnum.userTrackReadOptions, JSON.stringify(readOptionsArray));

    this.mahetaService.openLoadingDialog();
    this.musicLibraryTracksService
      .resetTracksLibrary()
      .then(() => this.mahetaService.closeLoadingDialog())
      .catch(() => this.mahetaService.closeLoadingDialog());
    this.dialogRef.close();
  }

  public close(): void {
    this.dialogRef.close();
  }

  private getReadOptions(): ReadOptionsLocalStorage[] {
    const storageItem = localStorage.getItem(LocalStorageEnum.userTrackReadOptions);
    if (!storageItem) {
      return [];
    }

    const userReadOptions = JSON.parse(storageItem);
    if (!isArray(userReadOptions)) {
      return [];
    }

    userReadOptions.filter((readOption) => 'path' in readOption);
    return [...userReadOptions];
  }

  private buildForm(): void {
    const readOptionsPaths = this.getReadOptions().map(
      (readOptions: ReadOptionsLocalStorage) => readOptions.path
    );
    this.form = this.fb.group({
      readOptionsPaths: this.fb.array([...readOptionsPaths, ...Array(2).fill([''])]),
    });
  }
}
