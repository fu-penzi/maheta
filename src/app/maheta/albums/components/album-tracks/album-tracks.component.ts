import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Album } from '@src/app/db/domain/album';
import { Track } from '@src/app/db/domain/track.schema';

@Component({
  selector: 'maheta-album-tracks',
  templateUrl: './album-tracks.component.html',
  styleUrls: ['./album-tracks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumTracksComponent {
  @Input() public album: Album;
  @Input() public currentTrack: Track | null;

  constructor() {}
}
