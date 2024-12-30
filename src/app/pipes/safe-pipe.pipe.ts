import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { TrackDefaultsEnum } from '@src/app/db/domain/track';

@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}

  transform(value: string | undefined): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(value || TrackDefaultsEnum.THUMBSRC);
  }
}
