import { TestBed } from '@angular/core/testing';

import { RabotaService } from './rabota.service';

describe('RabotaService', () => {
  let service: RabotaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RabotaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
