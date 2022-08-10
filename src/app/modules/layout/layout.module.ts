import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { PlayerBarComponent } from '@src/app/modules/layout/components/player-bar/player-bar.component';
import { LayoutComponent } from '@src/app/modules/layout/layout.component';
import { ThemeService } from '@src/app/modules/layout/services/theme.service';
import { SharedModule } from '@src/app/modules/shared/shared.module';

@NgModule({
  declarations: [LayoutComponent, PlayerBarComponent],
  imports: [SharedModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  providers: [ThemeService],
})
export class LayoutModule {}
