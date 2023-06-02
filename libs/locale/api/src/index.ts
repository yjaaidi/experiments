import {LocaleRepository} from '@demo/locale/domain';
import {inject} from '@demo/shared/injector';
import {provideLocaleAdapters} from '@demo/locale/adapters';

export function provideLocaleApi() {
  // @todo
  // provideLocaleAdapters()
}

export class LocaleFinder {
  constructor(private _repo = inject(LocaleRepository)) {

  }

  localeExists(id: string): boolean {
    return this._repo.getLocales().some(locale => locale.id === id);
  }
}
