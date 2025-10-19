import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeRegisterComponent } from './recipe-register.component';

describe('RecipeRegisterComponent', () => {
  let component: RecipeRegisterComponent;
  let fixture: ComponentFixture<RecipeRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeRegisterComponent]
    });
    fixture = TestBed.createComponent(RecipeRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
