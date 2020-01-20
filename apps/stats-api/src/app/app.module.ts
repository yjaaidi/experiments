import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PubSub } from 'graphql-subscriptions';
import { StatsResolver } from './stats.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql'
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    StatsResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub()
    }
  ]
})
export class AppModule {}
