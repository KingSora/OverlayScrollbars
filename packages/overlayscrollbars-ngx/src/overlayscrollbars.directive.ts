import { Directive, Input, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { InitializationTarget } from 'overlayscrollbars';
import type { OverlayScrollbarsComponent } from './overlayscrollbars.component';

type Defer = [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestDefer: (callback: () => any, options?: OverlayScrollbarsComponent['defer']) => void,
  cancelDefer: () => void,
];

const createDefer = (): Defer => {
  /* istanbul ignore next */
  if (typeof window === 'undefined') {
    // mock ssr calls with "noop"

    const noop = () => {};
    return [noop, noop];
  }

  let idleId: number;
  let rafId: number;
  const wnd = window;
  const idleSupported = typeof wnd.requestIdleCallback === 'function';
  const rAF = wnd.requestAnimationFrame;
  const cAF = wnd.cancelAnimationFrame;
  const rIdle = idleSupported ? wnd.requestIdleCallback : rAF;
  const cIdle = idleSupported ? wnd.cancelIdleCallback : cAF;
  const clear = () => {
    cIdle(idleId);
    cAF(rafId);
  };

  return [
    (callback, options) => {
      clear();
      idleId = rIdle(
        idleSupported
          ? () => {
              clear();
              // inside idle its best practice to use rAF to change DOM for best performance
              rafId = rAF(callback);
            }
          : callback,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        typeof options === 'object' ? options : { timeout: 2233 }
      );
    },
    clear,
  ];
};

@Directive({
  selector: '[overlayScrollbars]', // https://angular.io/guide/styleguide#directive-selectors
})
export class OverlayScrollbarsDirective implements OnChanges {
  private instanceRef: OverlayScrollbars | null = null;
  private requestDefer: ReturnType<typeof createDefer>[0];
  private cancelDefer: ReturnType<typeof createDefer>[1];

  @Input('options')
  options?: OverlayScrollbarsComponent['options'];
  @Input('events')
  events?: OverlayScrollbarsComponent['events'];
  @Input('defer')
  defer?: OverlayScrollbarsComponent['defer'];

  constructor(private ngZone: NgZone) {
    const [requestDefer, cancelDefer] = createDefer();
    this.requestDefer = requestDefer;
    this.cancelDefer = cancelDefer;
  }

  osInitialize(target: InitializationTarget): void {
    this.ngZone.runOutsideAngular(() => {
      const init = () => {
        this.instanceRef = OverlayScrollbars(
          target,
          this.options || {},
          /* istanbul ignore next */
          this.events || {}
        );
      };

      if (this.defer) {
        this.requestDefer(init, this.defer);
      } else {
        init();
      }
    });
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

  ngOnDestroy() {
    this.cancelDefer();
  }
}
