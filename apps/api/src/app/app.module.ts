import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { FileSearch } from './file-search.service';
import { UnsubscribeOnCloseInterceptor } from './unsubscribe-on-close.interceptor';

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
