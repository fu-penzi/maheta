import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { DatabaseService } from '@src/app/db/database.service';
import { LocalStorageEnum } from '@src/app/model/localStorage.enum';
import { ReadOptionsLocalStorage } from '@src/app/model/read-options-local.storage';
import { LoadingDialogComponent } from '@src/app/modules/shared/dialog/loading-dialog/loading-dialog.component';

import { isArray } from 'lodash';

@Component({
  selector: 'maheta-edit-storage-settings-dialog',
  templateUrl: './edit-storage-settings-dialog.component.html',
  styleUrls: ['./edit-storage-settings-dialog.component.scss'],
})
export class EditStorageSettingsDialogComponent implements OnInit {
  public form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditStorageSettingsDialogComponent>,
    private databaseService: DatabaseService,
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

    const dialogConf: MatDialogConfig<LoadingDialogComponent> = {
      width: '100%',
      disableClose: true,
    };
    const loadingDialogRef: MatDialogRef<LoadingDialogComponent> = this.matDialogService.open(
      LoadingDialogComponent,
      dialogConf
    );

    this.databaseService
      .reloadDatabaseTrackData()
      .then(() => loadingDialogRef.close())
      .catch(() => loadingDialogRef.close());
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
