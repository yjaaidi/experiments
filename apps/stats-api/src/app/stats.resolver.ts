import { Inject } from '@nestjs/common';
import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Field, Int, ObjectType } from 'type-graphql';

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
  constructor(@Inject('PUB_SUB') private _pubSub) {}

  @Query(returns => String)
  appName() {
    return 'Stats'
  }

  @Subscription(returns => Stat, {
    nullable: true
  })
  statAdded() {
    return this._pubSub.asyncIterator('statAdded');
  }
}
