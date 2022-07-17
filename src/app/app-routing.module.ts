import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UrlEnum } from '@src/app/model/url.enum';
import { LayoutComponent } from '@src/app/modules/layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: UrlEnum.PLAYER, pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: UrlEnum.PLAYER,
        loadChildren: () => import('./maheta/player/player.module').then((m) => m.PlayerModule),
      },
      {
        path: UrlEnum.SONGS,
        loadChildren: () => import('./maheta/songs/songs.module').then((m) => m.SongsModule),
      },
    ],
    // canActivate: [],
  },
  { path: '**', redirectTo: UrlEnum.PLAYER, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
