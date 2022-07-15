import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './modules/layout/layout.component';

import { UrlEnum } from '@app/model/url.enum';

const routes: Routes = [
  { path: '', redirectTo: UrlEnum.PLAYER, pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: UrlEnum.PLAYER, loadChildren: () => import('./maheta/player/player.module').then((m) => m.PlayerModule) },
      { path: UrlEnum.SONGS, loadChildren: () => import('./maheta/songs/songs.module').then((m) => m.SongsModule) },
    ],
  },
  { path: '**', redirectTo: UrlEnum.PLAYER, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
