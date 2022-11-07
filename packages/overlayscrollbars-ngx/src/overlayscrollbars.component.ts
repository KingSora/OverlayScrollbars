/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnDestroy,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
  NgZone,
} from '@angular/core';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { PartialOptions, EventListeners, EventListenerMap } from 'overlayscrollbars';

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
  selector: '[overlay-scrollbars]', // https://angular.io/guide/styleguide#component-selectors
  exportAs: 'overlayScrollbars',
  host: { 'data-overlayscrollbars': '' },
  template: `<div #content><ng-content></ng-content></div>`,
})
export class OverlayScrollbarsComponent implements OnDestroy, OnChanges, AfterViewInit {
  private instanceRef: OverlayScrollbars | null = null;

  @ViewChild('content')
  private contentRef?: ElementRef<HTMLDivElement>;

  @Input('options')
  options?: PartialOptions | false | null;
  @Input('events')
  events?: EventListeners | false | null;

  @Output('osInitialized')
  onInitialized = new EventEmitter<EventListenerMap['initialized']>();
  @Output('osUpdated')
  onUpdated = new EventEmitter<EventListenerMap['updated']>();
  @Output('osDestroyed')
  onDestroyed = new EventEmitter<EventListenerMap['destroyed']>();
  @Output('osScroll')
  onScroll = new EventEmitter<EventListenerMap['scroll']>();

  constructor(private targetRef: ElementRef<HTMLElement>, private ngZone: NgZone) {}

  private mergedEvents(originalEvents: OverlayScrollbarsComponent['events']) {
    return mergeEventListeners(
      {
        initialized: (...args) => this.onInitialized.emit(args),
        updated: (...args) => this.onUpdated.emit(args),
        destroyed: (...args) => this.onDestroyed.emit(args),
        scroll: (...args) => this.onScroll.emit(args),
      },
      originalEvents || {}
    );
  }

  instance(): OverlayScrollbars | null {
    return this.instanceRef;
  }

  element(): HTMLElement {
    return this.targetRef.nativeElement;
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      const targetElm = this.element();
      const contentElm = this.contentRef!.nativeElement;

      /* istanbul ignore else */
      if (targetElm && contentElm) {
        this.instanceRef = OverlayScrollbars(
          {
            target: targetElm,
            elements: {
              viewport: contentElm,
              content: contentElm,
            },
          },
          this.options || {},
          this.mergedEvents(this.events)
        );
      }
    });
  }

  ngOnDestroy() {
    this.instanceRef?.destroy();
  }

  ngOnChanges(changes: SimpleChanges) {
    const optionsChange = changes.options;
    const eventsChange = changes.events;

    if (OverlayScrollbars.valid(this.instanceRef)) {
      if (optionsChange) {
        this.instanceRef.options(optionsChange.currentValue || {}, true);
      }
      if (eventsChange) {
        this.instanceRef.on(this.mergedEvents(eventsChange.currentValue), true);
      }
    }
  }
}
