import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Album } from '@src/app/db/domain/album';
import { Track } from '@src/app/db/domain/track.schema';

import { sum } from 'lodash';

@Component({
  selector: 'maheta-album-tracks',
  templateUrl: './album-tracks.component.html',
  styleUrls: ['./album-tracks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumTracksComponent implements OnChanges {
  @Input() public album: Album;
  @Input() public currentTrack: Track | null;

  public totalAlbumTime: number = 0;
  constructor() {}

  public ngOnChanges(): void {
    this.totalAlbumTime = sum(this.album.tracks.map((track: Track) => track.duration));
  }
}
