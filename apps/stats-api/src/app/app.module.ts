import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { pubSubServiceName } from './pub-sub';
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
      provide: pubSubServiceName,
      useValue: new PubSub()
    }
  ]
})
export class AppModule {}
