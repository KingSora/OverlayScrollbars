import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, OverlayscrollbarsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
