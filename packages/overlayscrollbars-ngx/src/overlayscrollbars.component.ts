/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
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
  template: `<div overlayScrollbars [options]="options" [events]="mergeEvents(events)" #content>
    <ng-content></ng-content>
  </div>`,
  styles: [':host { display: block; }'],
})
export class OverlayScrollbarsComponent implements OnDestroy, AfterViewInit {
  @Input('options')
  options?: PartialOptions | false | null;
  @Input('events')
  events?: EventListeners | false | null;

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

  constructor(private targetRef: ElementRef<HTMLElement>) {}

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
    this.osDirective?.osInstance()!.destroy();
  }

  mergeEvents(originalEvents: OverlayScrollbarsComponent['events']) {
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
}
