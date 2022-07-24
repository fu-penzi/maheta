import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackScrollViewComponent } from './track-scroll-view.component';

describe('TrackScrollViewComponent', () => {
  let component: TrackScrollViewComponent;
  let fixture: ComponentFixture<TrackScrollViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackScrollViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackScrollViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
