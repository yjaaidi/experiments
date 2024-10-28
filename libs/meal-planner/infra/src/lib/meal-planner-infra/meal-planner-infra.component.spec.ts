import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MealPlannerInfraComponent } from './meal-planner-infra.component';

describe('MealPlannerInfraComponent', () => {
  let component: MealPlannerInfraComponent;
  let fixture: ComponentFixture<MealPlannerInfraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealPlannerInfraComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MealPlannerInfraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
