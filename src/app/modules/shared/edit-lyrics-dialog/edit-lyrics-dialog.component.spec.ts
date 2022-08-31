import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLyricsDialogComponent } from './edit-lyrics-dialog.component';

describe('EditLyricsDialogComponent', () => {
  let component: EditLyricsDialogComponent;
  let fixture: ComponentFixture<EditLyricsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLyricsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLyricsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
