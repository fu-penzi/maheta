import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Track } from '@src/app/db/domain/track.schema';
import { UrlEnum } from '@src/app/model/url.enum';
import { UrlParamsEnum } from '@src/app/model/url-params.enum';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { PlayerSheetService } from '@src/app/services/player-sheet.service';

import { takeUntil } from 'rxjs';

@Component({
  selector: 'maheta-player-sheet',
  templateUrl: './player-sheet.component.html',
  styleUrls: ['./player-sheet.component.scss'],
})
export class PlayerSheetComponent extends BaseComponent implements OnInit {
  public currentTrack: Track;
  public queue: Track[];

  constructor(
    private musicControlService: MusicControlService,
    private playerSheetService: PlayerSheetService,
    private router: Router
  ) {
    super();
  }

  public get queuePosition(): number {
    return this.musicControlService.queuePosition;
  }

  public get queueSize(): number {
    return this.musicControlService.queueSize;
  }

  public ngOnInit(): void {
    this.musicControlService.currentTrack$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((currentTrack: Track) => {
        this.currentTrack = currentTrack;
      });

    this.musicControlService.currentQueue$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((currentQueue: Track[]) => {
        this.queue = currentQueue;
      });
  }

  public navigateToAlbum(): void {
    this.close();
    this.router.navigate(['/' + UrlEnum.ALBUMS], {
      queryParams: { [UrlParamsEnum.albumTitle]: this.currentTrack?.album },
    });
  }

  public close(): void {
    this.playerSheetService.close();
  }
}
