import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { Track } from '@src/app/db/domain/track.schema';
import { UrlEnum } from '@src/app/model/url.enum';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { RepeatModeEnum } from '@src/app/services/queue.service';

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
    slidesPerView: 1.4,
    spaceBetween: 25,
    centeredSlides: true,
  };

  constructor(
    private readonly musicControlService: MusicControlService,
    private bottomSheetRef: MatBottomSheetRef<PlayerSheetComponent>
  ) {
    super();
  }

  public get albumUrl(): string {
    return '/' + UrlEnum.ALBUMS + '/' + this.currentTrack?.album;
  }

  private get queuePosition(): number {
    return this.musicControlService.queuePosition;
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
