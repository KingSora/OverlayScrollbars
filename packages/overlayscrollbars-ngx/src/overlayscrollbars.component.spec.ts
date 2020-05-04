import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayScrollbarsComponent } from './overlayscrollbars.component';

describe('OverlayScrollbarsComponent', () => {
  let component: OverlayScrollbarsComponent;
  let fixture: ComponentFixture<OverlayScrollbarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OverlayScrollbarsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayScrollbarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
