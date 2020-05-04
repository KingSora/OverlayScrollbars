import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayscrollbarsNgxComponent } from './overlayscrollbars-ngx.component';

describe('OverlayscrollbarsNgxComponent', () => {
  let component: OverlayscrollbarsNgxComponent;
  let fixture: ComponentFixture<OverlayscrollbarsNgxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverlayscrollbarsNgxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayscrollbarsNgxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
