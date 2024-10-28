import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeFeatureSuggestionsComponent } from './recipe-feature-suggestions.component';

describe('RecipeFeatureSuggestionsComponent', () => {
  let component: RecipeFeatureSuggestionsComponent;
  let fixture: ComponentFixture<RecipeFeatureSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeFeatureSuggestionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeFeatureSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
