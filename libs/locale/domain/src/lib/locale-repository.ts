import { Locale } from './locale';

export interface LocaleRepository {
  getLocales(): Locale[]
}
