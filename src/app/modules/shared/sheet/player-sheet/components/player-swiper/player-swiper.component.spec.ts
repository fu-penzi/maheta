import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSwiperComponent } from '@src/app/modules/shared/sheet/player-sheet/components/player-swiper/player-swiper.component';

describe('PlayerSwiperComponent', () => {
  let component: PlayerSwiperComponent;
  let fixture: ComponentFixture<PlayerSwiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerSwiperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
