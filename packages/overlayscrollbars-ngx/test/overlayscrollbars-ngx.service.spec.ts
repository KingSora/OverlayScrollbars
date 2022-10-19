import { TestBed } from "@angular/core/testing";
import { OverlayscrollbarsNgxService } from "~/overlayscrollbars-ngx.service";

describe("OverlayscrollbarsNgxService", () => {
  let service: OverlayscrollbarsNgxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverlayscrollbarsNgxService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
