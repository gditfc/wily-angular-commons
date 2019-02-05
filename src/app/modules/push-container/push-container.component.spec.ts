import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushContainerComponent } from './push-container.component';

describe('PushContainerComponent', () => {
  let component: PushContainerComponent;
  let fixture: ComponentFixture<PushContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
