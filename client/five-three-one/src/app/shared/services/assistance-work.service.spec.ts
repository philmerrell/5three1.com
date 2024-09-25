import { TestBed } from '@angular/core/testing';

import { AssistanceWorkService } from './assistance-work.service';

describe('AssistanceWorkService', () => {
  let service: AssistanceWorkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssistanceWorkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
