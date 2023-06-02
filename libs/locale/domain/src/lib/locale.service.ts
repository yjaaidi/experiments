import { Locale } from './locale';
import {LocaleRepository} from './locale-repository';
import {inject, Injectable} from '@demo/shared/injector';

@Injectable()
export class LocaleService {

  constructor(private _repo = inject(LocaleRepository)) {
  }

  getLocales(): Locale[] {
    return this._repo.getLocales();
  }
}
