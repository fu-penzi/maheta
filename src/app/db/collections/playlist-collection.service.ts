import { Injectable } from '@angular/core';

import { CollectionService } from '@src/app/db/collections/collection.service';
import { Playlist } from '@src/app/db/domain/playlist';

@Injectable({
  providedIn: 'root',
})
export class PlaylistCollectionService extends CollectionService<Playlist> {}
