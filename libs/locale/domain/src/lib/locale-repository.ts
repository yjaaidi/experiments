import { Locale } from './locale';

export abstract class LocaleRepository {
  abstract getLocales(): Locale[]
}
