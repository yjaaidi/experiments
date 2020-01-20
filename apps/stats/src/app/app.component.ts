import { Component, OnInit } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'stats';

  private _statsSubscription = gql`
    subscription {
      stat {
        date
        cpuUsage
        memoryUsage
      }
    }
  `;

  constructor(private _apollo: Apollo) {}

  ngOnInit() {
    this._apollo
      .subscribe({
        query: this._statsSubscription
      })
      .subscribe(({ data }) => {
        console.log(data);
      });
  }
}
