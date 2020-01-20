import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { StatsResolver } from './stats.resolver';
import { StatsService } from './stats.service';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql'
    })
  ],
  providers: [
    StatsService,
    StatsResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub()
    }
  ]
})
export class AppModule {}
