import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFooterButtonsComponent } from './dialog-footer-buttons.component';

describe('DialogFooterButtonsComponent', () => {
  let component: DialogFooterButtonsComponent;
  let fixture: ComponentFixture<DialogFooterButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFooterButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogFooterButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
