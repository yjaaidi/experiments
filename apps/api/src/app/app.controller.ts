import { SearchResult } from '@demo/api-interfaces';
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { FileSearch } from './file-search.service';

@Controller()
export class AppController {
  constructor(private readonly appService: FileSearch) {
  }

  @Get('files')
  getData(@Req() request: Request): Observable<SearchResult> {
    return this.appService.search(request.query['q']);
  }

}
