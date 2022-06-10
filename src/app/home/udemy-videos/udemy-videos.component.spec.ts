import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdemyVideosComponent } from './udemy-videos.component';

describe('UdemyVideosComponent', () => {
  let component: UdemyVideosComponent;
  let fixture: ComponentFixture<UdemyVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UdemyVideosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UdemyVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
