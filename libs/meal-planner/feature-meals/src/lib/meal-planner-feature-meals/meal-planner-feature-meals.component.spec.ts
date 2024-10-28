import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MealPlannerFeatureMealsComponent } from './meal-planner-feature-meals.component';

describe('MealPlannerFeatureMealsComponent', () => {
  let component: MealPlannerFeatureMealsComponent;
  let fixture: ComponentFixture<MealPlannerFeatureMealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealPlannerFeatureMealsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MealPlannerFeatureMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
