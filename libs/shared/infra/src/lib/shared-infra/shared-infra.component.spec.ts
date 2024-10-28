import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedInfraComponent } from './shared-infra.component';

describe('SharedInfraComponent', () => {
  let component: SharedInfraComponent;
  let fixture: ComponentFixture<SharedInfraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedInfraComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedInfraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
