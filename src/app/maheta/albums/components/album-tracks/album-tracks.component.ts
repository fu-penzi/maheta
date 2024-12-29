import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Album } from '@src/app/db/domain/album';
import { Track } from '@src/app/db/domain/track.schema';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';

import { sum } from 'lodash';

@Component({
  selector: 'maheta-album-tracks',
  templateUrl: './album-tracks.component.html',
  styleUrls: ['./album-tracks.component.scss'],
})
export class AlbumTracksComponent implements OnChanges {
  @Input() public album: Album;
  @Input() public currentTrack: Track | null;

  public showSkeleton: boolean = true;
  public totalAlbumTime: number = 0;
  constructor(private musicControlService: MusicControlService) {}

  public get isSortingOrderAscending(): boolean {
    return this.musicControlService.isSortingOrderAscending;
  }

  public ngOnChanges(): void {
    this.totalAlbumTime = sum(this.album.tracks.map((track: Track) => track.duration));
  }
}
