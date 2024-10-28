import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeCoreComponent } from './recipe-core.component';

describe('RecipeCoreComponent', () => {
  let component: RecipeCoreComponent;
  let fixture: ComponentFixture<RecipeCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeCoreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
