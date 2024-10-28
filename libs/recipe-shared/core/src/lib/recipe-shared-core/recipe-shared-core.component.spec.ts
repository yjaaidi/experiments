import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeSharedCoreComponent } from './recipe-shared-core.component';

describe('RecipeSharedCoreComponent', () => {
  let component: RecipeSharedCoreComponent;
  let fixture: ComponentFixture<RecipeSharedCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeSharedCoreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeSharedCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
