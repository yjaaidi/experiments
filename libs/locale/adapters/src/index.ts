import {provide} from '@demo/shared/injector';
import {LocaleRepository} from '@demo/locale/domain';

import {LocaleRepositoryImpl, LocaleRepositoryImplConfig} from './lib/locale-repository.impl';

export {LocaleRepositoryImpl};

export function provideLocaleAdapters(repoConfig: LocaleRepositoryImplConfig) {
  provide(LocaleRepository, { useClass: LocaleRepositoryImpl});
  provide(LocaleRepositoryImplConfig, { value: repoConfig })
}
