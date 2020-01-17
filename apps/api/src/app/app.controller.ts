import { SearchResult } from '@demo/api-interfaces';
import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';

import { FileSearch } from './file-search.service';

@Controller()
export class AppController {
  constructor(private readonly appService: FileSearch) {
  }

  @Get('hello')
  getData(): Observable<SearchResult> {
    return this.appService.search();
  }

}
