import {Request, Response} from 'express';
import {LocaleService} from '@demo/locale/domain';
import {LocaleRepositoryImpl} from '@demo/locale/adapters';

const localeService = new LocaleService(new LocaleRepositoryImpl());

export function getLocalesHandler(req: Request, res: Response) {
  res.send(localeService.getLocales());
}
