import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ThreeScene } from '../three-scene.service';
import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements OnDestroy, OnInit {

  private _mesh = this._createMesh();

  constructor(private _threeScene: ThreeScene) {
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
