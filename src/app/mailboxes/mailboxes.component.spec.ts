import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailboxesComponent } from './mailboxes.component';

describe('MailboxesComponent', () => {
  let component: MailboxesComponent;
  let fixture: ComponentFixture<MailboxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailboxesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailboxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
