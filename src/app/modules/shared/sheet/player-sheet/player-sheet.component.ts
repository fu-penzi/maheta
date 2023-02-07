import { AfterViewInit, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Track } from '@src/app/db/domain/track.schema';
import { UrlEnum } from '@src/app/model/url.enum';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { PlayerSheetService } from '@src/app/services/player-sheet.service';
import { RepeatModeEnum } from '@src/app/services/queue.service';

import { Platform } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import { Swiper } from 'swiper/types';
import { VirtualOptions } from 'swiper/types/modules/virtual';
import { takeUntil } from 'rxjs';
import { SwiperOptions } from 'swiper';

const initSwiperOptions: SwiperOptions = {
  spaceBetween: 15,
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
const initVirtualOptions: VirtualOptions = {
  enabled: true,
  addSlidesBefore: 2,
  addSlidesAfter: 2,
};

@Component({
  selector: 'maheta-player-sheet',
  templateUrl: './player-sheet.component.html',
  styleUrls: ['./player-sheet.component.scss'],
})
export class PlayerSheetComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  @HostBinding('class.transition') viewInitComplete: boolean = false;

  public currentTrack: Track;
  public currentQueue: Track[];
  public rewind: boolean = false;

  public swiperVirtualOptions: VirtualOptions = { ...initVirtualOptions };
  public swiperOptions: SwiperOptions = { slidesPerView: this.slidesPerView, ...initSwiperOptions };

  constructor(
    private musicControlService: MusicControlService,
    private platform: Platform,
    private router: Router,
    private playerSheetService: PlayerSheetService
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

  private get slidesPerView(): number {
    return this.platform.height() < 675 ? 1.7 : 1.35;
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

    this.musicControlService.currentQueue$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((currentQueue: Track[]) => {
        this.currentQueue = currentQueue;
        this.swiperOptions.initialSlide = this.queuePosition;
        this.swiper?.swiperRef.virtual.update(true);
      });

    this.musicControlService.repeatMode$.subscribe((repeatModeEnum: RepeatModeEnum) => {
      if (this.swiper) {
        this.rewind = repeatModeEnum === RepeatModeEnum.REPEAT_QUEUE;
      }
    });
  }

  public ngAfterViewInit(): void {
    this.viewInitComplete = true;
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

  public trackByIndex(index: number): number {
    return index;
  }

  public close(): void {
    this.playerSheetService.close();
  }
}
