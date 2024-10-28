import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeSharedUiComponent } from './recipe-shared-ui.component';

describe('RecipeSharedUiComponent', () => {
  let component: RecipeSharedUiComponent;
  let fixture: ComponentFixture<RecipeSharedUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeSharedUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeSharedUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
