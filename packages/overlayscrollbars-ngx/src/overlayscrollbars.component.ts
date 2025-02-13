import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  NgZone,
} from '@angular/core';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { PartialOptions, EventListeners, EventListenerArgs } from 'overlayscrollbars';
import { OverlayScrollbarsDirective } from './overlayscrollbars.directive';

const mergeEventListeners = (emits: EventListeners, events: EventListeners) =>
  (Object.keys(emits) as (keyof EventListeners)[]).reduce<EventListeners>(
    <N extends keyof EventListeners>(obj: EventListeners, name: N) => {
      const emitListener = emits[name];
      const eventListener = events[name];
      /* istanbul ignore next */
      obj[name] = [
        emitListener,
        ...(Array.isArray(eventListener) ? eventListener : [eventListener]).filter(Boolean),
      ];
      return obj;
    },
    {}
  );

@Component({
  selector: 'overlay-scrollbars, [overlay-scrollbars]', // https://angular.io/guide/styleguide#component-selectors
  host: { 'data-overlayscrollbars-initialize': '' },
  template: `
    <div
      overlayScrollbars
      data-overlayscrollbars-contents=""
      [options]="options"
      [events]="mergeEvents(events)"
      [defer]="defer"
      #content
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class OverlayScrollbarsComponent implements OnDestroy, AfterViewInit {
  /** OverlayScrollbars options. */
  @Input('options')
  options?: PartialOptions | false | null;
  /** OverlayScrollbars events. */
  @Input('events')
  events?: EventListeners | false | null;
  /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
  @Input('defer')
  defer?: boolean | IdleRequestOptions;

  @Output('osInitialized')
  onInitialized = new EventEmitter<EventListenerArgs['initialized']>();
  @Output('osUpdated')
  onUpdated = new EventEmitter<EventListenerArgs['updated']>();
  @Output('osDestroyed')
  onDestroyed = new EventEmitter<EventListenerArgs['destroyed']>();
  @Output('osScroll')
  onScroll = new EventEmitter<EventListenerArgs['scroll']>();

  @ViewChild('content')
  private contentRef?: ElementRef<HTMLDivElement>;
  @ViewChild('content', { read: OverlayScrollbarsDirective })
  private osDirective?: OverlayScrollbarsDirective;

  constructor(
    private ngZone: NgZone,
    private targetRef: ElementRef<HTMLElement>
  ) {}

  osInstance(): OverlayScrollbars | null {
    return this.osDirective!.osInstance();
  }

  getElement(): HTMLElement {
    return this.targetRef.nativeElement;
  }

  ngAfterViewInit() {
    const targetElm = this.getElement();
    const contentElm = this.contentRef!.nativeElement;

    /* istanbul ignore else */
    if (targetElm && contentElm) {
      this.osDirective!.osInitialize({
        target: targetElm,
        elements: {
          viewport: contentElm,
          content: contentElm,
        },
      });
    }
  }

  ngOnDestroy() {
    this.osDirective?.osInstance()?.destroy();
  }

  mergeEvents(originalEvents: OverlayScrollbarsComponent['events']) {
    return mergeEventListeners(
      {
        initialized: (...args) => this.dispatchEventIfHasObservers(this.onInitialized, args),
        updated: (...args) => this.dispatchEventIfHasObservers(this.onUpdated, args),
        destroyed: (...args) => this.dispatchEventIfHasObservers(this.onDestroyed, args),
        scroll: (...args) => this.dispatchEventIfHasObservers(this.onScroll, args),
      },
      originalEvents || {}
    );
  }

  private dispatchEventIfHasObservers<T>(eventEmitter: EventEmitter<T>, args: T): void {
    // `observed` is available since RxJS@7.2 because `observers` is being deprecated.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((eventEmitter as any).observed || eventEmitter.observers.length > 0) {
      // This is required to re-enter the Angular zone to call the event handler in the Angular
      // zone too. This will not re-enter the Angular zone if emitter doesn't have any observers,
      // for instance, it's being listened: `<overlay-scrollbars (osInitialized)="..."`.
      // Events are dispatched outside of the Angular zone because instance is created in the
      // `<root>` zone, see `OverlayScrollbarsDirective#osInitialize`.
      this.ngZone.run(() => eventEmitter.emit(args));
    }
  }
}
