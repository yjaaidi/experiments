import { Component } from '@angular/core';
import { Terminal } from './child/child.component';

@Component({
  selector: 'wt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isDisplayed = true;
  messageList$ = this._terminal.messageList$;

  constructor(private _terminal: Terminal) {
  }

}
