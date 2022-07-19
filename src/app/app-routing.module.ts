import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutChildrenGuard } from '@src/app/guards/layout-children.guard';
import { UrlEnum } from '@src/app/model/url.enum';
import { LayoutComponent } from '@src/app/modules/layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: UrlEnum.SONGS, pathMatch: 'full' },
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
    canActivate: [LayoutChildrenGuard],
  },
  { path: '**', redirectTo: UrlEnum.SONGS, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
