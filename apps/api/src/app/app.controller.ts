import { SearchResult } from '@demo/api-interfaces';
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { FileSearch } from './file-search.service';

@Controller('files')
export class AppController {
  constructor(private fileSearch: FileSearch) {
  }

  @Get()
  getData(@Req() request: Request): Observable<SearchResult> {
    return this.fileSearch.search(request.query['q']);
  }

}
