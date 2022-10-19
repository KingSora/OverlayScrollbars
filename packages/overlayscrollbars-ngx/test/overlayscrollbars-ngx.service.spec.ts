import { TestBed } from '@angular/core/testing';
import { OverlayscrollbarsService } from '~/overlayscrollbars.service';

describe('OverlayscrollbarsNgxService', () => {
  let service: OverlayscrollbarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverlayscrollbarsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
