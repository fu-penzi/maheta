import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  providers: [ThemeService],
})
export class LayoutModule {}
