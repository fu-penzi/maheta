import { Pipe, PipeTransform } from '@angular/core';

export interface DurationPipeConfig {
  noFallback?: boolean;
  hourMinuteFormat?: boolean;
}

@Pipe({
  name: 'mahetaDuration',
})
export class DurationPipe implements PipeTransform {
  transform(totalSeconds: number | undefined | null, config?: DurationPipeConfig): string {
    if (!totalSeconds) {
      return config?.noFallback ? '' : '0:00';
    }

    const seconds: number = Math.floor(totalSeconds % 60);
    const minutes: number = Math.floor(totalSeconds / 60);
    const hours: number = Math.floor(totalSeconds / 3600);

    if (config?.hourMinuteFormat) {
      let duration: string = '';
      if (hours) {
        duration += hours + 'h ';
      }
      if (minutes - hours * 60) {
        duration += minutes - hours * 60 + ' min';
      }
      return duration;
    }

    return Math.floor(minutes) + ':' + `${Math.floor(seconds)}`.padStart(2, '0');
  }
}
