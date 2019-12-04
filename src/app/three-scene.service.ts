import { WebGLRenderer, PerspectiveCamera, Scene, Mesh } from 'three';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThreeScene {
 
  private _camera = this._createCamera();
  private _scene = new Scene();
  private _renderer = this._createRenderer();

  add(mesh: Mesh) {
    this._scene.add(mesh);
  }

  remove(mesh: Mesh) {
    this._scene.remove(mesh);
  }
 
  getDomElement() {
    return this._renderer.domElement;
  }

  render() {
    this._renderer.render(this._scene, this._camera);
  }

  private _createCamera() {
    const camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.x = 2;
    camera.position.z = 2;
    camera.rotation.y = 0.8;
    return camera;
  }

  private _createRenderer() {
    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    return renderer;
  }
}
