import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MealPlannerFeatureAddButtonComponent } from './meal-planner-feature-add-button.component';

describe('MealPlannerFeatureAddButtonComponent', () => {
  let component: MealPlannerFeatureAddButtonComponent;
  let fixture: ComponentFixture<MealPlannerFeatureAddButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealPlannerFeatureAddButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MealPlannerFeatureAddButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
