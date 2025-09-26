import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectPanelComponent } from './connect-panel.component';

describe('ConnectPanelComponent', () => {
  let component: ConnectPanelComponent;
  let fixture: ComponentFixture<ConnectPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
