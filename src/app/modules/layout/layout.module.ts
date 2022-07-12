import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { ThemeService } from './services/theme.service';

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, RouterModule],
  providers: [ThemeService],
})
export class LayoutModule {}
