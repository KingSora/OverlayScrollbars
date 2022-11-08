import { NgModule } from '@angular/core';
import { OverlayScrollbarsDirective } from './overlayscrollbars.directive';
import { OverlayScrollbarsComponent } from './overlayscrollbars.component';

@NgModule({
  declarations: [OverlayScrollbarsComponent, OverlayScrollbarsDirective],
  exports: [OverlayScrollbarsComponent, OverlayScrollbarsDirective],
})
export class OverlayscrollbarsModule {}
