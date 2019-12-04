import { CubeComponent } from './cube/cube.component';
import { Component, ViewChild, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { DirectionalLight, DirectionalLightHelper, Mesh, MeshBasicMaterial, BoxGeometry, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export const randomAngle = () => Math.random() * 360;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'three-benchmark';

  @ViewChild('scene', {static: true})
  sceneEl: ElementRef;

  @ViewChildren(CubeComponent) 
  cubeList: CubeComponent[];

  ngOnInit() {

  }

}

