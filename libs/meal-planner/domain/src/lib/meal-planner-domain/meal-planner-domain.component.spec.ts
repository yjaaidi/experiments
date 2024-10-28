import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MealPlannerDomainComponent } from './meal-planner-domain.component';

describe('MealPlannerDomainComponent', () => {
  let component: MealPlannerDomainComponent;
  let fixture: ComponentFixture<MealPlannerDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealPlannerDomainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MealPlannerDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
