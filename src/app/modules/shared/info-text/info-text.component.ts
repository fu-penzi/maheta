import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'maheta-info-text',
  templateUrl: './info-text.component.html',
  styleUrls: ['./info-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoTextComponent {
  @Input() text: string;
}
