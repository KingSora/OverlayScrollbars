/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Directive, Input, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { InitializationTarget } from 'overlayscrollbars';
import type { OverlayScrollbarsComponent } from './overlayscrollbars.component';

@Directive({
  selector: '[overlayScrollbars]', // https://angular.io/guide/styleguide#directive-selectors
})
export class OverlayScrollbarsDirective implements OnChanges {
  private instanceRef: OverlayScrollbars | null = null;

  @Input('options')
  options?: OverlayScrollbarsComponent['options'];
  @Input('events')
  events?: OverlayScrollbarsComponent['events'];

  constructor(private ngZone: NgZone) {}

  osInitialize(target: InitializationTarget): OverlayScrollbars {
    this.ngZone.runOutsideAngular(() => {
      this.instanceRef = OverlayScrollbars(
        target,
        this.options || {},
        /* istanbul ignore next */
        this.events || {}
      );
    });
    return this.instanceRef!;
  }

  osInstance(): OverlayScrollbars | null {
    return this.instanceRef;
  }

  ngOnChanges(changes: SimpleChanges) {
    const optionsChange = changes.options;
    const eventsChange = changes.events;

    if (optionsChange) {
      const curr = optionsChange.currentValue;

      this.options = curr;

      if (OverlayScrollbars.valid(this.instanceRef)) {
        this.instanceRef.options(curr || {}, true);
      }
    }
    /* istanbul ignore else */
    if (eventsChange) {
      const curr = eventsChange.currentValue;

      this.events = curr;

      if (OverlayScrollbars.valid(this.instanceRef)) {
        this.instanceRef.on(
          /* istanbul ignore next */
          curr || {},
          true
        );
      }
    }
  }
}
