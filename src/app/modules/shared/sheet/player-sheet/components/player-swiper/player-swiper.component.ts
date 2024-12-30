import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { Track } from '@src/app/db/domain/track';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import {
  initSwiperOptions,
  initVirtualOptions,
} from '@src/app/modules/shared/sheet/player-sheet/components/player-swiper/player-swiper.config';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { RepeatModeEnum } from '@src/app/services/queue.service';

import { Platform } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import { Swiper } from 'swiper/types';
import { VirtualOptions } from 'swiper/types/modules/virtual';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'maheta-player-swiper',
  templateUrl: './player-swiper.component.html',
  styleUrls: ['./player-swiper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerSwiperComponent extends BaseComponent implements OnInit, OnChanges {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  @Input() public currentTrack: Track;
  @Input() public queue: Track[];

  public swiperVirtualOptions: VirtualOptions = { ...initVirtualOptions };
  public swiperOptions: SwiperOptions = { slidesPerView: this.slidesPerView, ...initSwiperOptions };
  public rewind: boolean = false;

  constructor(private musicControlService: MusicControlService, private platform: Platform) {
    super();
  }

  public get queuePosition(): number {
    return this.musicControlService.queuePosition;
  }

  private get slidesPerView(): number {
    return this.platform.height() < 675 ? 1.7 : 1.35;
  }

  private get swiperRef(): Swiper | undefined {
    return this.swiper?.swiperRef;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentTrack'] && this.swiperRef?.activeIndex !== this.queuePosition) {
      this.updateSliderPosition();
    }
    if (changes['queue']) {
      this.swiperOptions.initialSlide = this.queuePosition;
    }
  }

  public ngOnInit(): void {
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
      this.musicControlService.prev(true);
      return;
    }
  }

  public updateSliderPosition(): void {
    return this.swiperRef?.slideTo(this.queuePosition);
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
