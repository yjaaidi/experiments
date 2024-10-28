import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilTestingComponent } from './shared-util-testing.component';

describe('SharedUtilTestingComponent', () => {
  let component: SharedUtilTestingComponent;
  let fixture: ComponentFixture<SharedUtilTestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilTestingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
