import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from '@src/app/modules/layout/layout.component';
import { ThemeService } from '@src/app/modules/layout/services/theme.service';

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  providers: [ThemeService],
})
export class LayoutModule {}
