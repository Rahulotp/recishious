import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsHomeComponent } from './reviews-home.component';

describe('ReviewsHomeComponent', () => {
  let component: ReviewsHomeComponent;
  let fixture: ComponentFixture<ReviewsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewsHomeComponent]
    });
    fixture = TestBed.createComponent(ReviewsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
