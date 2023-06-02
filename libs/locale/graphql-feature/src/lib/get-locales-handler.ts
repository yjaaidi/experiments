import {Request, Response} from 'express';
import {LocaleService} from '@demo/locale/domain';
import {provideLocaleAdapters} from '@demo/locale/adapters';
import {inject} from '@demo/shared/injector';

provideLocaleAdapters({endpoint: 'my-dynamo-endpoint'});

export function getLocalesHandler(req: Request, res: Response) {
    const localeService = inject(LocaleService);
    res.send(localeService.getLocales());
}
