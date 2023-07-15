import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <a href="https://www.npmjs.com/package/overlayscrollbars-ngx" target="_blank">
      <h1>OverlayScrollbars Ngx</h1>
    </a>
    <overlay-scrollbars
      class="overlayscrollbars-ngx"
      style="width: 222px; height: 222px;"
      [options]="{ scrollbars: { theme: 'os-theme-light' } }"
    >
      <div class="logo">
        <img alt="Angular logo" src="assets/logo.svg" width="333" height="333" />
      </div>
    </overlay-scrollbars>
  `,
  styles: [],
})
export class AppComponent {}
