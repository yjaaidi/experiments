import {
  BaseHarnessFilters,
  ComponentHarness,
  ComponentHarnessConstructor,
  HarnessPredicate,
  HarnessQuery,
} from '@angular/cdk/testing';

export class EasyHarness extends ComponentHarness {
  async get<T extends HarnessQuery<any> | string>(
    query: T,
    filter?: BaseHarnessFilters
  ) {
    const queryWithFilter = this._applyFilter(query, filter);
    return await this.locatorFor(queryWithFilter as T)();
  }

  async getAll<T extends HarnessQuery<any> | string>(
    query: T,
    filter?: BaseHarnessFilters
  ) {
    const queryWithFilter = this._applyFilter(query, filter);
    return await this.locatorForAll(queryWithFilter as T)();
  }

  private _applyFilter<
    T extends HarnessQuery<H> | string,
    H extends ComponentHarness
  >(query: T, filter?: BaseHarnessFilters) {
    return filter && _isHarnessType(query)
      ? new HarnessPredicate(query, filter)
      : query;
  }
}

function _isHarnessType<H extends ComponentHarness>(
  query: HarnessQuery<H> | string
): query is ComponentHarnessConstructor<H> {
  return 'hostSelector' in (query as any);
}
