import { SearchResult } from '@demo/api-interfaces';
import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get('hello')
  getData(): Observable<SearchResult> {
    return this.appService.getData();
  }

}
