import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitProposal } from './submit-proposal';

describe('SubmitProposal', () => {
  let component: SubmitProposal;
  let fixture: ComponentFixture<SubmitProposal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitProposal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitProposal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
