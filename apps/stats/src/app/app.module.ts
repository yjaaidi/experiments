import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AreaChartModule, LineChartModule } from '@swimlane/ngx-charts';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { OperationDefinitionNode } from 'graphql';

import { AppComponent } from './app.component';

export function initApollo(apollo: Apollo, httpClient: HttpClient) {
  return () => {
    const httpLink = new HttpLink(httpClient).create({
      uri: '___REGULAR_ENDPOINT___'
    });

    const subscriptionLink = new WebSocketLink({
      uri: 'ws://localhost:3334/graphql',
      options: {
        reconnect: true
      }
    });

    const link = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(
          query
        ) as OperationDefinitionNode;
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      subscriptionLink,
      httpLink
    );

    apollo.create({
      link,
      cache: new InMemoryCache()
    });
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    ApolloModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    AreaChartModule,
    LineChartModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [Apollo, HttpClient],
      useFactory: initApollo,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
