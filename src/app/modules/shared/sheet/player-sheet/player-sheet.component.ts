import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

import { Track } from '@src/app/db/domain/track.schema';
import { UrlEnum } from '@src/app/model/url.enum';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { RepeatModeEnum } from '@src/app/services/queue.service';

import { Platform } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import { Swiper } from 'swiper/types';
import { VirtualOptions } from 'swiper/types/modules/virtual';
import { take, takeUntil } from 'rxjs';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'maheta-player',
  templateUrl: './player-sheet.component.html',
  styleUrls: ['./player-sheet.component.scss'],
})
export class PlayerSheetComponent extends BaseComponent implements OnInit {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  public currentTrack: Track;
  public currentQueue: Track[];
  public rewind: boolean = false;

  public swiperVirtualOptions: VirtualOptions = {
    enabled: true,
    addSlidesBefore: 2,
    addSlidesAfter: 2,
  };
  public swiperOptions: SwiperOptions = {
    slidesPerView: this.platform.height() < 675 ? 1.7 : 1.35,
    spaceBetween: 25,
    centeredSlides: true,
    touchEventsTarget: 'container',
    /* eslint-disable @typescript-eslint/naming-convention */
    breakpoints: {
      601: {
        slidesPerView: 1.6,
        spaceBetween: 40,
      },
      981: {
        slidesPerView: 1.8,
        spaceBetween: 150,
      },
      1201: {
        slidesPerView: 2,
        spaceBetween: 150,
      },
      1536: {
        slidesPerView: 3,
        spaceBetween: 150,
      },
    },
  };

  constructor(
    private readonly musicControlService: MusicControlService,
    private bottomSheetRef: MatBottomSheetRef<PlayerSheetComponent>,
    private platform: Platform,
    private router: Router
  ) {
    super();
  }

  public get albumUrl(): string {
    return '/' + UrlEnum.ALBUMS + '/' + this.currentTrack?.album;
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
        if (this.swiper?.swiperRef.activeIndex !== this.queuePosition) {
          this.updateSliderPosition();
        }
      });

    this.musicControlService.currentQueue$.pipe(take(1)).subscribe((currentQueue: Track[]) => {
      this.currentQueue = currentQueue;
      this.swiperOptions.initialSlide = this.queuePosition;
    });

    this.musicControlService.repeatMode$.subscribe((repeatModeEnum: RepeatModeEnum) => {
      if (this.swiper) {
        this.rewind = repeatModeEnum === RepeatModeEnum.REPEAT_QUEUE;
      }
    });
  }

  public navigateToAlbum(): void {
    this.close();
    this.router.navigate([this.albumUrl]);
  }

  public handleSlideChange([swiper]: [swiper: Swiper]): void {
    const shouldPlayPosition: boolean =
      this.musicControlService.isRepeatOne ||
      (this.musicControlService.isRepeatQueue && (swiper.isBeginning || swiper.isEnd));

    if (shouldPlayPosition) {
      this.musicControlService.playPosition(swiper.activeIndex);
      return;
    }
    if (this.queuePosition < swiper.activeIndex) {
      this.musicControlService.next();
      return;
    }
    if (this.queuePosition > swiper.activeIndex) {
      this.musicControlService.prev();
      return;
    }
  }

  public updateSliderPosition(): void {
    return this.swiper?.swiperRef.slideTo(this.queuePosition);
  }

  public close(): void {
    this.bottomSheetRef.dismiss();
  }
}
