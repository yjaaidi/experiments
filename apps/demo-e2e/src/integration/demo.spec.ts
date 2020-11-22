import {
  ElementDimensions,
  HarnessEnvironment,
  ModifierKeys,
  TestElement,
  TestKey,
  TextOptions,
} from '@angular/cdk/testing';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';

export class CypressElement implements TestElement {
  constructor(readonly element: JQuery<HTMLElement>) {}

  blur(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  clear(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  click(): Promise<void>;
  click(location: 'center'): Promise<void>;
  click(relativeX: number, relativeY: number): Promise<void>;
  click(relativeX?: any, relativeY?: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  rightClick?(relativeX: number, relativeY: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  focus(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getCssValue(property: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  hover(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  mouseAway(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  sendKeys(...keys: (string | TestKey)[]): Promise<void>;
  sendKeys(
    modifiers: ModifierKeys,
    ...keys: (string | TestKey)[]
  ): Promise<void>;
  sendKeys(modifiers?: any, ...keys: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  text(options?: TextOptions): Promise<string> {
    throw new Error('Method not implemented.');
  }
  getAttribute(name: string): Promise<string> {
    return Promise.resolve(this.element.attr(name));
  }
  hasClass(name: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  getDimensions(): Promise<ElementDimensions> {
    throw new Error('Method not implemented.');
  }
  getProperty(name: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  matchesSelector(selector: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  isFocused(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  setInputValue?(value: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  selectOptions?(...optionIndexes: number[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  dispatchEvent?(name: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export class CypressHarnessEnvironment extends HarnessEnvironment<
  JQuery<HTMLElement>
> {
  static loader(): Cypress.Chainable<CypressHarnessEnvironment> {
    return cy.get('body').pipe((body) => new CypressHarnessEnvironment(body));
  }

  forceStabilize(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  waitForTasksOutsideAngular(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  protected getDocumentRoot(): JQuery<HTMLElement> {
    throw new Error('Method not implemented.');
  }
  protected createTestElement(element: JQuery<HTMLElement>): TestElement {
    return new CypressElement(element);
  }
  protected createEnvironment(
    element: JQuery<HTMLElement>
  ): HarnessEnvironment<JQuery<HTMLElement>> {
    return new CypressHarnessEnvironment(element);
  }
  protected getAllRawElements(
    selector: string
  ): Promise<JQuery<HTMLElement>[]> {
    return Promise.resolve(
      this.rawRootElement
        .find(selector)
        .toArray()
        .map((el) => Cypress.$(el))
    );
  }
}

describe('demo', () => {
  beforeEach(() => cy.visit('/'));

  it('should select date', () => {
    const loader = CypressHarnessEnvironment.loader();
    loader
      .pipe(
        async (loader) => {
          const harness = await loader.getHarness(MatDatepickerInputHarness);
          return harness.isCalendarOpen();
        },
        {
          timeout: 10,
        }
      )
      .should('be.false');
  });
});
