import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import { AppModule } from './app/app.module';

OverlayScrollbars.plugin(ClickScrollPlugin);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
