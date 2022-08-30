import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { DatabaseService } from '@src/app/db/database.service';

@Component({
  selector: 'maheta-create-playlist-dialog',
  templateUrl: './create-playlist-dialog.component.html',
  styleUrls: ['./create-playlist-dialog.component.scss'],
})
export class CreatePlaylistDialogComponent implements OnInit {
  public form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CreatePlaylistDialogComponent>,
    private fb: FormBuilder,
    private databaseService: DatabaseService
  ) {}

  public ngOnInit(): void {
    this.buildForm();
  }

  public save(): void {
    this.databaseService.createPlaylist(this.playlistName?.value);
    this.close();
  }

  public close(): void {
    this.dialogRef.close();
  }

  private get playlistName(): AbstractControl {
    return this.form.get('playlistName') as AbstractControl;
  }

  private buildForm(): void {
    this.form = this.fb.group({
      playlistName: [''],
    });
  }
}
