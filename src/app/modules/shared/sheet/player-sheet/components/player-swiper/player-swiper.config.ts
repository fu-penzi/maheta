import { VirtualOptions } from 'swiper/types/modules/virtual';
import { SwiperOptions } from 'swiper';

export const initSwiperOptions: SwiperOptions = {
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
export const initVirtualOptions: VirtualOptions = {
  enabled: true,
  addSlidesBefore: 2,
  addSlidesAfter: 2,
};
