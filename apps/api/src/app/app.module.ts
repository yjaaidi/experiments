import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { FileSearchMongo } from './file-search-mongo.service';
import { FileSearch } from './file-search.service';
import { UnsubscribeOnCloseInterceptor } from './unsubscribe-on-close.interceptor';
import { fstat } from 'fs';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    FileSearch,
    {
      provide: APP_INTERCEPTOR,
      useClass: UnsubscribeOnCloseInterceptor
    }
  ]
})
export class AppModule {}
