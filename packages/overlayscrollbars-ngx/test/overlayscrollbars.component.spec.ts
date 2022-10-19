import { TestBed } from '@angular/core/testing';
import { OverlayscrollbarsComponent } from '~/overlayscrollbars.component';
import type { ComponentFixture } from '@angular/core/testing';

describe('OverlayscrollbarsNgxComponent', () => {
  let component: OverlayscrollbarsComponent;
  let fixture: ComponentFixture<OverlayscrollbarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverlayscrollbarsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayscrollbarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
