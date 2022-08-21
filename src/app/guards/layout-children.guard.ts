import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';

import { DatabaseService } from '@src/app/db/database.service';
import { Playlist } from '@src/app/db/domain/playlist.schema';
import { Track } from '@src/app/db/domain/track.schema';
import { FileLoadingService } from '@src/app/services/file-loading.service';
import { MusicLibraryService } from '@src/app/services/music-library.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutChildrenGuard implements CanActivate {
  constructor(
    private readonly fileLoadingService: FileLoadingService,
    private musicLibraryService: MusicLibraryService,
    private databaseService: DatabaseService
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return (
      this.databaseService
        .initDatabase()
        .then(() => this.databaseService.isTrackCollectionEmpty())
        //TODO reload on user button click
        .then((isEmpty: boolean) => (isEmpty ? this.databaseService.reloadDatabaseData() : {}))
        .then(() => this.databaseService.getTracks())
        .then((tracks: Track[]) => {
          this.musicLibraryService.tracks = tracks;
          return this.databaseService.getPlaylists();
        })
        .then((playlists: Playlist[]) => {
          this.musicLibraryService.playlists = playlists;
          return true;
        })
        .catch((err) => {
          console.error(err);
          return false;
        })
    );
  }
}
