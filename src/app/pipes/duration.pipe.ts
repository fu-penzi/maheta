import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mahetaDuration',
})
export class DurationPipe implements PipeTransform {
  transform(totalSeconds: number, ...args: unknown[]): string {
    const seconds: number = totalSeconds % 60;
    const minutes: number = totalSeconds / 60;
    return Math.floor(minutes) + ':' + `${Math.floor(seconds)}`.padStart(2, '0');
  }
}
