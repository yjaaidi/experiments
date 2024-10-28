import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeFeatureSearchComponent } from './recipe-feature-search.component';

describe('RecipeFeatureSearchComponent', () => {
  let component: RecipeFeatureSearchComponent;
  let fixture: ComponentFixture<RecipeFeatureSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeFeatureSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeFeatureSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
