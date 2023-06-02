import { Locale } from './locale';
import {LocaleRepository} from './locale-repository';

export class LocaleService {

  constructor(private _repo: LocaleRepository) {
  }

  getLocales(): Locale[] {
    return this._repo.getLocales();
  }
}
