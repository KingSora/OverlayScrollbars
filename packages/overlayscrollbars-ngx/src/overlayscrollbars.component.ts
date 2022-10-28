import { Component } from '@angular/core';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { OnInit } from '@angular/core';

console.log(OverlayScrollbars);

@Component({
  selector: 'overlay-scrollbars',
  template: ` <p>overlayscrollbars-ngx works!</p> `,
  styles: [],
})
export class OverlayscrollbarsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
