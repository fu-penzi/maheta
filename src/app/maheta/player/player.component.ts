import { Component } from '@angular/core';

@Component({
  selector: 'maheta-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  public showTicks: boolean = false;
  public autoTicks: boolean = false;
  public tickInterval: number = 1;
  public value: number = 1;
  constructor() {}

  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }
}
