import { Component, OnInit } from '@angular/core';

import { getDefaultTrackObject, Track } from '@src/app/db/domain/track.schema';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MahetaService } from '@src/app/services/maheta.service';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';

import { filter, map, Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'maheta-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss'],
})
export class PlayerBarComponent extends BaseComponent implements OnInit {
  public trackProgress$: Observable<number> = new Observable<number>();

  constructor(
    private musicControlService: MusicControlService,
    private mahetaService: MahetaService
  ) {
    super();
  }

  public get currentTrack(): Track {
    return this.musicControlService.currentTrack;
  }

  public get defaultTrack(): Track {
    return getDefaultTrackObject();
  }

  public ngOnInit(): void {
    this.trackProgress$ = this.musicControlService.currentTrackAudioTime$.pipe(
      takeUntil(this.onDestroy$),
      map(
        (currentTrackTime: number) =>
          (currentTrackTime / this.musicControlService.currentTrackDuration) * 100
      ),
      filter((trackProgress: number) => !!trackProgress)
    );
  }

  public openPlayerSheet(): void {
    if (!this.currentTrack) {
      return;
    }
    this.mahetaService.openPlayerSheet();
  }

  public play(): void {
    this.musicControlService.play();
  }

  public pause(): void {
    this.musicControlService.pause();
  }

  public next(): void {
    this.musicControlService.next();
  }

  public prev(): void {
    this.musicControlService.prev();
  }

  public isPlaying(): boolean {
    return this.musicControlService.isPlaying;
  }
}
