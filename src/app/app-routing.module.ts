import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LayoutChildrenGuard } from '@src/app/guards/layout-children.guard';
import { UrlEnum } from '@src/app/model/url.enum';
import { LayoutComponent } from '@src/app/modules/layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: UrlEnum.ALBUMS, pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: UrlEnum.SETTINGS,
        loadChildren: () =>
          import('./maheta/settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: UrlEnum.SONGS,
        loadChildren: () => import('./maheta/songs/songs.module').then((m) => m.SongsModule),
      },
      {
        path: UrlEnum.ALBUMS,
        loadChildren: () => import('./maheta/albums/albums.module').then((m) => m.AlbumsModule),
      },
      {
        path: UrlEnum.PLAYLISTS,
        loadChildren: () =>
          import('./maheta/playlists/playlists.module').then((m) => m.PlaylistsModule),
      },
    ],
    canActivate: [LayoutChildrenGuard],
  },
  { path: '**', redirectTo: UrlEnum.ALBUMS, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
