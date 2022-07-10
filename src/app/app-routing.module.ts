import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './modules/layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'player', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'player', loadChildren: () => import('./maheta/player/player.module').then((m) => m.PlayerModule) },
    ],
  },
  { path: '**', redirectTo: 'player', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
