import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobProposals } from './job-proposals';

describe('JobProposals', () => {
  let component: JobProposals;
  let fixture: ComponentFixture<JobProposals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobProposals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobProposals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
