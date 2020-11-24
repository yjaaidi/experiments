import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { DemoComponent, DemoModule } from './demo.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('Demo', () => {
  let fixture: ComponentFixture<DemoComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    return TestBed.configureTestingModule({
      imports: [DemoModule, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => (fixture = TestBed.createComponent(DemoComponent)));
  beforeEach(() => (loader = TestbedHarnessEnvironment.loader(fixture)));

  it('should show cells', async () => {
    const datepicker = await loader.getHarness(MatDatepickerInputHarness);
    datepicker.openCalendar();
    const calendar = await datepicker.getCalendar();
    const cells = await calendar.getCells();
    const texts = await Promise.all(cells.map((cell) => cell.getText()));
    expect(texts).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28',
      '29',
      '30',
    ]);
  });
});
