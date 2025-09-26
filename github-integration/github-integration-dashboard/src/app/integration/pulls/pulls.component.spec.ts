import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullsComponent } from './pulls.component';

describe('PullsComponent', () => {
  let component: PullsComponent;
  let fixture: ComponentFixture<PullsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PullsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PullsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
