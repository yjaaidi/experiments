import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { ThreeScene } from '../three-scene.service';
import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three';
import { CubeInfo } from './cube-info';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements OnChanges, OnDestroy, OnInit {

  @Input() cubeInfo: CubeInfo;

  private _mesh = this._createMesh();

  constructor(private _threeScene: ThreeScene) {
  }

  ngOnChanges() {
    this._mesh.rotation.x = this.cubeInfo.rotation.x;
  }

  ngOnInit() {
    this._threeScene.add(this._mesh);
  }

  ngOnDestroy() {
    this._threeScene.remove(this._mesh);
  }

  private _createMesh() {

    const mesh = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshBasicMaterial({ color: 0xffffff * Math.random() })
    );

    mesh.rotation.x = Math.random() * 360;
    mesh.rotation.y = Math.random() * 360;
    mesh.rotation.z = Math.random() * 360;

    return mesh;

  }

}
