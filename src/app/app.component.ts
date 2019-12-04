import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cubeInfoList = Array(1000).fill(null);

  setCount(count: number) {
    this.cubeInfoList = Array(count).fill(null);
  }

}

