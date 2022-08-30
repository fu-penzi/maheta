import { NgModule } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from '@src/app/app.component';
import { AppRoutingModule } from '@src/app/app-routing.module';
import { LayoutModule } from '@src/app/modules/layout/layout.module';
import { SharedModule } from '@src/app/modules/shared/shared.module';
import { MusicControlModule } from '@src/app/services/music-control/music-control.module';

import { MusicControls } from '@awesome-cordova-plugins/music-controls/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    MusicControlModule,
  ],
  providers: [FormBuilder, MusicControls, SharedModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
