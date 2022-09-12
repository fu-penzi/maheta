import { Injectable } from '@angular/core';

import { Playlist, PlaylistDefaultsEnum } from '@src/app/db/domain/playlist.schema';
import { CollectionService } from '@src/app/db/model/collection.service';

@Injectable({
  providedIn: 'root',
})
export class PlaylistCollectionService extends CollectionService<Playlist> {
  public createPlaylist(name?: string): Promise<void> {
    const id: string = `${Math.floor(Math.random() * 1000)}`;
    const playlist: Playlist = {
      id,
      name: name || PlaylistDefaultsEnum.NAME + id,
      thumbUrl: PlaylistDefaultsEnum.THUMBURL,
      tracks: [],
    };
    return this.collection.upsert(playlist);
  }
}
