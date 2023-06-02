import {Locale, LocaleRepository} from '@demo/locale/domain';
import {inject} from '@demo/shared/injector';

export abstract class LocaleRepositoryImplConfig {
    abstract endpoint: string;
}

export class LocaleRepositoryImpl implements LocaleRepository {
    constructor(private _config = inject(LocaleRepositoryImplConfig)) {
    }

    getLocales(): Locale[] {
        return [
            {
                id: `${this._config.endpoint}/fr`,
                name: 'fr_FR'
            },
            {
                id: `${this._config.endpoint}/en`,
                name: 'en_US'
            }
        ];
    }
}
