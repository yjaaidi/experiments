import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeUiComponent } from './recipe-ui.component';

describe('RecipeUiComponent', () => {
  let component: RecipeUiComponent;
  let fixture: ComponentFixture<RecipeUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
