import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadtestComponent } from './loadtest.component';

describe('LoadtestComponent', () => {
  let component: LoadtestComponent;
  let fixture: ComponentFixture<LoadtestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadtestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
