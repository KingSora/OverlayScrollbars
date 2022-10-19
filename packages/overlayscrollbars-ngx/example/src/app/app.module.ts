import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OverlayscrollbarsModule } from '~/overlayscrollbars.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, OverlayscrollbarsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
