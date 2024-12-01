// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { OverlayScrollbars } from 'overlayscrollbars';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-ngx';
import type { EventListeners } from 'overlayscrollbars';
import { eventObserver } from './eventObserver';

const initBodyOverlayScrollbars = (force?: boolean) =>
  OverlayScrollbars(
    {
      target: document.body,
      cancel: {
        body: force ? false : null,
      },
    },
    {
      scrollbars: {
        theme: 'os-theme-light',
        clickScroll: true,
      },
    }
  ).state().destroyed;

@Component({
  selector: 'app-root',
  template: `
    <main>
      <h1>
        <a href="https://www.npmjs.com/package/overlayscrollbars-ngx" target="_blank">
          OverlayScrollbars Ngx
        </a>
      </h1>
      <section>
        <div
          overlay-scrollbars
          #osRef
          *ngIf="useOverlayScrollbars"
          class="overlayscrollbars-ngx"
          [ngStyle]="{ display: elementHidden ? 'none' : undefined }"
          [options]="options"
          [events]="events"
          [defer]="true"
        >
          <div *ngIf="!contentHidden" class="logo">
            <img alt="Angular logo" src="assets/logo.svg" />
          </div>
        </div>
        <div *ngIf="!useOverlayScrollbars" class="overlayscrollbars-ngx">
          <div class="logo">
            <img alt="Angular logo" src="assets/logo.svg" />
          </div>
        </div>
      </section>
      <section>
        <p class="title">Actions:</p>
        <div class="items">
          <ng-template [ngIf]="useOverlayScrollbars">
            <button (click)="scrollContent()">Scroll</button>
            <button (click)="toggleContent()">
              <ng-template [ngIf]="contentHidden"> Show </ng-template>
              <ng-template [ngIf]="!contentHidden"> Hide </ng-template>
              Content
            </button>
            <button (click)="toggleElement()">
              <ng-template [ngIf]="elementHidden"> Show </ng-template>
              <ng-template [ngIf]="!elementHidden"> Hide </ng-template>
              Element
            </button>
          </ng-template>
          <button (click)="useOverlayScrollbars = !useOverlayScrollbars">
            <ng-template [ngIf]="useOverlayScrollbars"> Destroy </ng-template>
            <ng-template [ngIf]="!useOverlayScrollbars"> Initialize </ng-template>
            OverlayScrollbars
          </button>
        </div>
      </section>
      <section>
        <p class="title">Events:</p>
        <div class="items">
          <div
            *ngFor="let observedEvent of observedEvents$ | async | keyvalue : originalOrder"
            [ngClass]="{ event: true, active: observedEvent.value.active }"
          >
            {{ observedEvent.key }}
            ({{ observedEvent.value.count }})
          </div>
        </div>
      </section>
    </main>
    <footer>
      <section *ngIf="useBodyOverlayScrollbars !== null">
        <div class="items">
          <button (click)="toggleBodyOverlayScrollbars()">
            <ng-template [ngIf]="useBodyOverlayScrollbars"> Destroy </ng-template>
            <ng-template [ngIf]="!useBodyOverlayScrollbars"> Initialize </ng-template>
            Body OverlayScrollbars
          </button>
        </div>
      </section>
      <a
        href="https://github.com/KingSora/OverlayScrollbars/tree/master/examples/angular"
        target="_blank"
      >
        Open source code of this example.
      </a>
    </footer>
  `,
  styles: [],
})
export class AppComponent {
  contentHidden = false;
  elementHidden = false;
  useOverlayScrollbars = true;
  useBodyOverlayScrollbars: boolean | null = null;
  options = {
    scrollbars: {
      theme: 'os-theme-light',
    },
  };
  events: EventListeners;
  observedEvents$: ReturnType<typeof eventObserver>[0];

  @ViewChild('osRef', { read: OverlayScrollbarsComponent })
  osRef?: OverlayScrollbarsComponent;

  constructor(cdr: ChangeDetectorRef) {
    const [observedEvents, activateEvent] = eventObserver(cdr);
    this.events = {
      initialized: () => activateEvent('initialized'),
      destroyed: () => activateEvent('destroyed'),
      updated: () => activateEvent('updated'),
      scroll: () => activateEvent('scroll'),
    };
    this.observedEvents$ = observedEvents;
  }

  scrollContent() {
    const osInstance = this.osRef?.osInstance();

    if (!osInstance) {
      return;
    }

    const { overflowAmount } = osInstance.state();
    const { scrollOffsetElement } = osInstance.elements();
    const { scrollLeft, scrollTop } = scrollOffsetElement;

    scrollOffsetElement.scrollTo({
      behavior: 'smooth',
      left: Math.round((overflowAmount.x - scrollLeft) / overflowAmount.x) * overflowAmount.x,
      top: Math.round((overflowAmount.y - scrollTop) / overflowAmount.y) * overflowAmount.y,
    });
  }

  toggleContent() {
    this.contentHidden = !this.contentHidden;
  }

  toggleElement() {
    this.elementHidden = !this.elementHidden;
  }

  toggleBodyOverlayScrollbars() {
    const bodyOsInstance = OverlayScrollbars(document.body);
    if (bodyOsInstance) {
      bodyOsInstance.destroy();
      this.useBodyOverlayScrollbars = false;
    } else {
      this.useBodyOverlayScrollbars = !initBodyOverlayScrollbars(true);
    }
  }

  ngOnInit() {
    this.useBodyOverlayScrollbars = !initBodyOverlayScrollbars();
  }

  originalOrder() {
    return 0;
  }
}
