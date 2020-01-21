import { SearchResult } from '@demo/api-interfaces';
import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileSearch } from './file-search.service';


@Controller('files')
export class AppController {
  constructor(private fileSearch: FileSearch) {
  }

  @Get()
  getData(@Query('q') keywords: string): Observable<SearchResult> {
    return this.fileSearch.search(keywords);
  }

}
