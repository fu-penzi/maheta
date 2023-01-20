import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { Track } from '@src/app/db/domain/track.schema';
import { UrlEnum } from '@src/app/model/url.enum';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';

import { SwiperComponent } from 'swiper/angular';
import { VirtualOptions } from 'swiper/types/modules/virtual';
import { takeUntil } from 'rxjs';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'maheta-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  public currentTrack: Track;
  public currentQueue: Track[];
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

  constructor(private readonly musicControlService: MusicControlService) {
    super();
  }

  public get albumUrl(): string {
    return '/' + UrlEnum.ALBUMS + '/' + this.currentTrack?.album;
  }

  public ngOnInit(): void {
    this.musicControlService.currentTrack$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((currentTrack: Track) => {
        this.currentTrack = currentTrack;
        this.updateSliderPosition();
      });

    this.musicControlService.currentQueue$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((currentQueue: Track[]) => {
        this.currentQueue = currentQueue;
      });
  }

  public ngAfterViewInit(): void {
    this.updateSliderPosition(1);
  }

  public updateSliderPosition(speed?: number): void {
    return speed
      ? this.swiper?.swiperRef.slideTo(this.musicControlService.queuePosition, speed)
      : this.swiper?.swiperRef.slideTo(this.musicControlService.queuePosition);
  }
}
