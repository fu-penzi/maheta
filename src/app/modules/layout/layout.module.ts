import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { AppBarComponent } from '@src/app/modules/layout/components/app-bar/app-bar.component';
import { PlayerBarComponent } from '@src/app/modules/layout/components/player-bar/player-bar.component';
import { LayoutComponent } from '@src/app/modules/layout/layout.component';
import { ThemeService } from '@src/app/modules/layout/services/theme.service';
import { SharedModule } from '@src/app/modules/shared/shared.module';

@NgModule({
  declarations: [LayoutComponent, PlayerBarComponent, AppBarComponent],
  imports: [
    SharedModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSidenavModule,
    MatRippleModule,
  ],
  providers: [ThemeService],
})
export class LayoutModule {}
