import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@src/app/modules/shared/shared.module';

import { SettingsComponent } from '@maheta/settings/settings.component';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    TranslateModule,
    RouterModule.forChild([
      {
        path: '',
        component: SettingsComponent,
      },
    ]),
    SharedModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
})
export class SettingsModule {}
