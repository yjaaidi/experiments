import { TestBed } from '@angular/core/testing';
import { MealFilterComponent, MealFilterModule } from './meal-filter.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MealFilterHarness } from './meal-filter.harness';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MealFilterComponent', () => {
  it('should trigger filterChange event', async () => {
    const { component, harness } = await createComponent();
    const observer = jest.fn();
    component.filterChange.subscribe(observer);
    await harness.setStartDate(new Date(Date.UTC(2021, 5, 1)));
    await harness.setEndDate(new Date(Date.UTC(2021, 5, 10)));

    expect(observer).toHaveBeenLastCalledWith({
      start: new Date(Date.UTC(2021, 5, 1)),
      end: new Date(Date.UTC(2021, 5, 10)),
    });
  });

  async function createComponent() {
    await TestBed.configureTestingModule({
      imports: [MealFilterModule, NoopAnimationsModule],
    }).compileComponents();
    const fixture = TestBed.createComponent(MealFilterComponent);
    return {
      component: fixture.componentInstance,
      harness: await TestbedHarnessEnvironment.harnessForFixture(
        fixture,
        MealFilterHarness
      ),
    };
  }
});
