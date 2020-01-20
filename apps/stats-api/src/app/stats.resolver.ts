import { Inject } from '@nestjs/common';
import { Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Field, Int, ObjectType } from 'type-graphql';
import { pubSubServiceName, statAdded } from './pub-sub';

@ObjectType()
export class Stat {
  @Field(type => Date)
  date: Date;

  @Field(type => Int)
  cpuUsage: number;

  @Field(type => Int)
  memoryUsage: number;
}

@Resolver('Stats')
export class StatsResolver {
  constructor(@Inject(pubSubServiceName) private _pubSub: PubSub) {
  }

  @Query(returns => String)
  appName() {
    return 'Stats';
  }

  @Subscription(returns => Stat, {
    nullable: true,
    resolve: value => value
  })
  stat() {
    return this._pubSub.asyncIterator(statAdded);
  }
}
