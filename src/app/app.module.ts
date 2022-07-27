import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from '@src/app/app.component';
import { AppRoutingModule } from '@src/app/app-routing.module';
import { LayoutModule } from '@src/app/modules/layout/layout.module';
import { MusicControlModule } from '@src/app/services/music-control/music-control.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    MusicControlModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
