import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'maheta-dialog-footer-buttons',
  templateUrl: './dialog-footer-buttons.component.html',
  styleUrls: ['./dialog-footer-buttons.component.scss'],
})
export class DialogFooterButtonsComponent {
  @Input() primaryButtonLabel: string;
  @Input() secondaryButtonLabel: string;

  @Output() secondaryButtonEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() primaryButtonEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  public secondaryButtonClick(): void {
    this.secondaryButtonEvent.next();
  }

  public primaryButtonClick(): void {
    this.primaryButtonEvent.next();
  }
}
