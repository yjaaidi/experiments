import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeInfraComponent } from './recipe-infra.component';

describe('RecipeInfraComponent', () => {
  let component: RecipeInfraComponent;
  let fixture: ComponentFixture<RecipeInfraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeInfraComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeInfraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
