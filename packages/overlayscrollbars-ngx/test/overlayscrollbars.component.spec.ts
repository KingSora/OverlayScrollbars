import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { ComponentFixture } from '@angular/core/testing';
import type { EventListenerArgs } from 'overlayscrollbars';
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsDirective,
  OverlayscrollbarsModule,
} from '../src/public-api';

@Component({
  template: `
    <div
      overlay-scrollbars
      [options]="options"
      [events]="events"
      [defer]="defer"
      (osInitialized)="onInitialized($event)"
      (osUpdated)="onUpdated($event)"
      (osDestroyed)="onDestroyed($event)"
      (osScroll)="onScroll($event)"
      [ngClass]="clazz"
      [ngStyle]="style"
      #ref
    >
      hello <span>angular</span>
      <div *ngIf="children === 0" id="empty">empty</div>
      <section *ngFor="let child of [].constructor(children)" [attr.data-key]="child">hi</section>
    </div>
    <button id="add" (click)="add($event)">add</button>
    <button id="remove" (click)="remove($event)">remove</button>
  `,
})
class Test {
  children = 1;
  options: OverlayScrollbarsComponent['options'];
  events: OverlayScrollbarsComponent['events'];
  defer: OverlayScrollbarsComponent['defer'];
  clazz?: string[];
  style?: Record<string, any>;
  initialized?: (...args: any) => void;
  updated?: (...args: any) => void;
  destroyed?: (...args: any) => void;
  scroll?: (...args: any) => void;

  @ViewChild('ref', { read: OverlayScrollbarsComponent })
  ref?: OverlayScrollbarsComponent;

  onInitialized(args: EventListenerArgs['initialized']) {
    this.initialized?.(args);
  }

  onUpdated(args: EventListenerArgs['updated']) {
    this.updated?.(args);
  }

  onDestroyed(args: EventListenerArgs['destroyed']) {
    this.destroyed?.(args);
  }

  onScroll(args: EventListenerArgs['scroll']) {
    this.scroll?.(args);
  }

  add() {
    this.children += 1;
  }

  remove() {
    this.children -= 1;
  }
}

@Component({
  template: `
    <span overlay-scrollbars #span>span</span>
    <overlay-scrollbars #os>span</overlay-scrollbars>
  `,
})
class TestTag {
  @ViewChild('span', { read: OverlayScrollbarsComponent })
  spanRef?: OverlayScrollbarsComponent;
  @ViewChild('os', { read: OverlayScrollbarsComponent })
  osRef?: OverlayScrollbarsComponent;
}

describe('OverlayscrollbarsNgxComponent', () => {
  let component: OverlayScrollbarsComponent;
  let fixture: ComponentFixture<OverlayScrollbarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      ...new OverlayscrollbarsModule(),
      declarations: [OverlayScrollbarsComponent, OverlayScrollbarsDirective, Test, TestTag],
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayScrollbarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('correct rendering', () => {
    it('has instance', async () => {
      expect(component).toBeTruthy();
      expect(component.getElement()).toBeDefined();
      expect(OverlayScrollbars.valid(component.osInstance())).toBe(true);
    });

    it('has data-overlayscrollbars-initialize', async () => {
      const testFixture = TestBed.createComponent(Test);
      const testComponent = testFixture.nativeElement as HTMLElement;

      testFixture.detectChanges();

      expect(testComponent?.querySelector('[data-overlayscrollbars-initialize]')).toBeTruthy();
    });

    it('has children', async () => {
      const testFixture = TestBed.createComponent(Test);
      const testComponent = testFixture.nativeElement as HTMLElement;
      const osElement = testComponent.firstElementChild;
      const child = osElement?.querySelector('span');
      const childrenParent = child?.parentElement;

      expect(child).toBeDefined();
      expect(childrenParent).toBeDefined();

      testFixture.detectChanges();

      expect(osElement?.querySelector('span')?.parentElement).toBe(childrenParent);
    });

    it('handles dynamic children', async () => {
      const testFixture = TestBed.createComponent(Test);
      const testComponent = testFixture.nativeElement as HTMLElement;
      const osElement = testComponent.firstElementChild;
      testFixture.detectChanges();

      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const children = osElement?.querySelectorAll('section')!;
      const child = children[0];
      const childrenParent = child?.parentElement;
      const addBtn = testComponent.querySelector('#add') as HTMLButtonElement;
      const removeBtn = testComponent.querySelector('#remove') as HTMLButtonElement;

      expect(children.length).toBe(1);
      expect(child).toBeTruthy();
      expect(childrenParent).toBeTruthy();
      expect(osElement?.querySelector('#empty')).toBeFalsy();

      addBtn.click();
      addBtn.click();
      testFixture.detectChanges();

      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const newChildren = osElement?.querySelectorAll('section')!;
      expect(newChildren.length).toBe(3);
      newChildren.forEach((currChild) => {
        expect(currChild.parentElement).toBe(childrenParent);
      });

      removeBtn.click();
      removeBtn.click();
      removeBtn.click();
      testFixture.detectChanges();

      expect(osElement?.querySelectorAll('section')?.length).toBe(0);
      expect(osElement?.querySelector('#empty')).toBeTruthy();
    });

    it('handles class change', async () => {
      const testFixture = TestBed.createComponent(Test);
      const testComponent = testFixture.nativeElement as HTMLElement;
      const testInstance = testFixture.componentInstance;
      const osElement = testComponent.firstElementChild;

      testInstance.clazz = ['overlay', 'scrollbars'];

      testFixture.detectChanges();

      expect(osElement?.className).toBe('overlay scrollbars');

      testInstance.clazz = ['overlay', 'scrollbars', 'angular'];

      testFixture.detectChanges();

      expect(osElement?.className).toBe('overlay scrollbars angular');
    });

    it('handles style change', async () => {
      const testFixture = TestBed.createComponent(Test);
      const testComponent = testFixture.nativeElement as HTMLElement;
      const testInstance = testFixture.componentInstance;
      const osElement = testComponent.firstElementChild;

      testInstance.style = { width: '22px' };

      testFixture.detectChanges();

      expect(osElement?.getAttribute('style')).toBe('width: 22px;');

      testInstance.style = { height: '33px' };

      testFixture.detectChanges();

      expect(osElement?.getAttribute('style')).toBe('height: 33px;');
    });
  });

  describe('deferred initialization', () => {
    it('basic defer', async () => {
      const testFixture = TestBed.createComponent(Test);
      const testInstance = testFixture.componentInstance;

      testInstance.defer = true;
      testFixture.detectChanges();

      const testComponent = testFixture.nativeElement as HTMLElement;
      const osElement = testComponent.firstElementChild;

      expect(OverlayScrollbars(osElement! as HTMLElement)).toBeUndefined();

      await new Promise((r) => setTimeout(r, 2000));

      expect(OverlayScrollbars(osElement! as HTMLElement)).toBeDefined();
    });

    it('options defer', async () => {
      const testFixture = TestBed.createComponent(Test);
      const testInstance = testFixture.componentInstance;

      testInstance.defer = { timeout: 0 };
      testFixture.detectChanges();

      const testComponent = testFixture.nativeElement as HTMLElement;
      const osElement = testComponent.firstElementChild;

      expect(OverlayScrollbars(osElement! as HTMLElement)).toBeUndefined();

      await new Promise((r) => setTimeout(r, 2000));

      expect(OverlayScrollbars(osElement! as HTMLElement)).toBeDefined();
    });

    it('defer with unsupported Idle', async () => {
      const original = window.requestIdleCallback;
      // @ts-ignore
      window.requestIdleCallback = undefined;

      const testFixture = TestBed.createComponent(Test);
      const testInstance = testFixture.componentInstance;

      testInstance.defer = true;
      testFixture.detectChanges();

      const testComponent = testFixture.nativeElement as HTMLElement;
      const osElement = testComponent.firstElementChild;

      expect(OverlayScrollbars(osElement! as HTMLElement)).toBeUndefined();

      await new Promise((r) => setTimeout(r, 2000));

      expect(OverlayScrollbars(osElement! as HTMLElement)).toBeDefined();

      window.requestIdleCallback = original;
    });
  });

  it('ref', () => {
    const testFixture = TestBed.createComponent(Test);
    const testInstance = testFixture.componentInstance;

    testFixture.detectChanges();

    const ref = testInstance.ref!;

    expect(testInstance.ref).toBeDefined();
    expect(typeof ref.osInstance).toBe('function');
    expect(typeof ref.getElement).toBe('function');
    expect(OverlayScrollbars.valid(ref.osInstance())).toBe(true);
    expect(ref.getElement()).toBe(testFixture.nativeElement.firstElementChild);
  });

  it('options', async () => {
    const testFixture = TestBed.createComponent(Test);
    const testInstance = testFixture.componentInstance;

    testInstance.options = { paddingAbsolute: true, overflow: { y: 'hidden' } };
    testFixture.detectChanges();

    const instance = testInstance.ref!.osInstance()!;

    const opts = instance.options();
    expect(opts.paddingAbsolute).toBe(true);
    expect(opts.overflow.y).toBe('hidden');

    testInstance.options = { overflow: { x: 'hidden' } };
    testFixture.detectChanges();

    const newOpts = instance.options();
    expect(newOpts.paddingAbsolute).toBe(false); //switches back to default because its not specified in the new options
    expect(newOpts.overflow.x).toBe('hidden');
    expect(newOpts.overflow.y).toBe('scroll'); //switches back to default because its not specified in the new options

    testInstance.options = { overflow: { x: 'hidden', y: 'hidden' } };
    testFixture.detectChanges();

    const newElementNewOpts = instance.options();
    expect(newElementNewOpts.paddingAbsolute).toBe(false);
    expect(newElementNewOpts.overflow.x).toBe('hidden');
    expect(newElementNewOpts.overflow.y).toBe('hidden');

    // reset options with `undefined`, `null`, `false` or `{}`
    testInstance.options = undefined;
    testFixture.detectChanges();

    const clearedOpts = instance.options();
    expect(clearedOpts.paddingAbsolute).toBe(false);
    expect(clearedOpts.overflow.x).toBe('scroll');
    expect(clearedOpts.overflow.y).toBe('scroll');

    // instance didn't change
    expect(instance).toBe(testInstance.ref!.osInstance()!);
  });

  it('events', async () => {
    const onInitialized = jasmine.createSpy();
    const onUpdated = jasmine.createSpy();
    const onUpdated2 = jasmine.createSpy();
    const testFixture = TestBed.createComponent(Test);
    const testInstance = testFixture.componentInstance;

    testInstance.events = { initialized: onInitialized };
    testFixture.detectChanges();

    const instance = testInstance.ref!.osInstance()!;

    expect(onInitialized).toHaveBeenCalledTimes(1);

    testInstance.events = { updated: onUpdated };
    testFixture.detectChanges();

    expect(onUpdated).not.toHaveBeenCalled();

    instance.update(true);
    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(onUpdated2).toHaveBeenCalledTimes(0);

    testInstance.events = { updated: [onUpdated, onUpdated2] };
    testFixture.detectChanges();

    instance.update(true);
    expect(onUpdated).toHaveBeenCalledTimes(2);
    expect(onUpdated2).toHaveBeenCalledTimes(1);

    // unregister with `[]`, `null` or `undefined`
    testInstance.events = { updated: null };
    testFixture.detectChanges();

    instance.update(true);
    expect(onUpdated).toHaveBeenCalledTimes(2);
    expect(onUpdated2).toHaveBeenCalledTimes(1);

    testInstance.events = { updated: [onUpdated, onUpdated2] };
    testFixture.detectChanges();

    instance.update(true);
    expect(onUpdated).toHaveBeenCalledTimes(3);
    expect(onUpdated2).toHaveBeenCalledTimes(2);

    // reset events with `undefined`, `null`, `false` or `{}`
    testInstance.events = undefined;
    testFixture.detectChanges();

    instance.update(true);
    expect(onInitialized).toHaveBeenCalledTimes(1);
    expect(onUpdated).toHaveBeenCalledTimes(3);
    expect(onUpdated2).toHaveBeenCalledTimes(2);

    // instance didn't change
    expect(instance).toBe(testInstance.ref!.osInstance()!);
  });

  it('destroys', async () => {
    fixture.destroy();
    expect(OverlayScrollbars.valid(component.osInstance())).toBe(false);
  });

  it('emits events correctly', async () => {
    const testFixture = TestBed.createComponent(Test);
    const testInstance = testFixture.componentInstance;

    const onInitialized = jasmine.createSpy();
    const onUpdated = jasmine.createSpy();
    const onDestroyed = jasmine.createSpy();
    const onScroll = jasmine.createSpy();

    testInstance.initialized = onInitialized;
    testInstance.updated = onUpdated;
    testInstance.destroyed = onDestroyed;
    testInstance.scroll = onScroll;

    testFixture.detectChanges();

    expect(onInitialized).toHaveBeenCalledTimes(1);
    expect(onInitialized).toHaveBeenCalledWith([jasmine.any(Object)]);

    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(onUpdated).toHaveBeenCalledWith([jasmine.any(Object), jasmine.any(Object)]);

    expect(onDestroyed).not.toHaveBeenCalled();
    expect(onScroll).not.toHaveBeenCalled();

    (testFixture.nativeElement as HTMLElement).querySelectorAll('*').forEach((e) => {
      e.dispatchEvent(new Event('scroll'));
    });

    expect(onDestroyed).not.toHaveBeenCalled();

    expect(onScroll).toHaveBeenCalledTimes(1);
    expect(onScroll).toHaveBeenCalledWith([jasmine.any(Object), jasmine.any(Event)]);

    testFixture.destroy();
    testFixture.detectChanges();

    expect(onDestroyed).toHaveBeenCalledTimes(1);
    expect(onDestroyed).toHaveBeenCalledWith([jasmine.any(Object), jasmine.any(Boolean)]);
  });

  it('has correct tags', async () => {
    const testFixture = TestBed.createComponent(TestTag);
    const testInstance = testFixture.componentInstance;

    testFixture.detectChanges();

    const osRef = testInstance.osRef!;
    const spanRef = testInstance.spanRef!;

    expect(osRef).toBeDefined();
    expect(spanRef).toBeDefined();

    expect(OverlayScrollbars.valid(osRef.osInstance())).toBe(true);
    expect(OverlayScrollbars.valid(spanRef.osInstance())).toBe(true);

    testFixture.destroy();

    expect(OverlayScrollbars.valid(osRef.osInstance())).toBe(false);
    expect(OverlayScrollbars.valid(spanRef.osInstance())).toBe(false);
  });
});
