import { Component, OnInit } from '@angular/core';
import { ThreeScene } from '../three-scene.service';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements OnInit {

  constructor(private _threeScene: ThreeScene) {
  }

  ngOnInit() {

  }

}
