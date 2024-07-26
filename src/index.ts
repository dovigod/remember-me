import * as THREE from 'three';
import { debounce } from 'es-toolkit'

import { Band } from './components/Band'

import { cameraSetting } from './constants'
import type { StageConstructor } from "./types/Stage"
import { createPhysicsContext } from './context/physicsContext';
import RAPIER from '@dimforge/rapier3d-compat';
class Stage {
  canvas!: HTMLCanvasElement;
  container!: HTMLElement;
  width!: number;
  height!: number;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera
  frame: number = 0
  clock = new THREE.Clock();
  world!: RAPIER.World
  composed: any[] = [];
  private ready: boolean = false;


  constructor({
    container,
    canvas,
  }: StageConstructor = {}) {

    this._prepareDOM(container, canvas)

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false
    });

    this.renderer.setClearColor('#333333')
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(cameraSetting.fov, this.container.offsetWidth / this.container.offsetHeight, cameraSetting.near, cameraSetting.far);
    this.camera.position.set(...cameraSetting.pos);

    this.addObjects();
    this._resize();
    this.attachListeners()

  }


  async setup() {
    if (this.ready) {
      return;
    }
    this.world = await createPhysicsContext();

    this.addObjects();
    this._resize();
    this.attachListeners()
    this.ready = true;

  }

  get context() {
    return {
      threeContext: this.threeContext,
      physicsContext: this.physicsContext
    }
  }

  get threeContext() {
    return {
      renderer: this.renderer,
      scene: this.scene,
      canvas: this.canvas,
      clock: this.clock,
      frame: this.frame,
      dimension: {
        width: this.width,
        height: this.height
      }
    }
  }

  get physicsContext() {
    return {
      world: this.world
    }
  }


  addObjects() {
    const band = new Band(this.context);
    this.composed.push(band);

    band.create();
  }
  render() {
    if (!this.ready) {
      return;
    }
    const self = this;
    const animate = () => {
      this.renderer.render(this.scene, this.camera);
      this.frame = requestAnimationFrame(animate.bind(self));
    }

    animate()
  }

  attachListeners() {
    const self = this;
    window.addEventListener('resize', debounce(this._resize.bind(self), 300));
  }


  /**
   * assign dom elements to member variables.
   * if provided params doesn't fit schema, use defaults
   * 
   * defaults as..
   * container : body,
   * canvas: canvas#remember-me-scene
   */
  private _prepareDOM(container: HTMLElement | string = document.body, canvas?: HTMLCanvasElement | string) {
    if (container) {
      if (typeof container === 'string') {
        this.container = document.getElementById(container) || document.body
      } else if (container instanceof HTMLElement) {
        this.container = container;
      }
    }

    if (canvas) {
      if (typeof canvas === 'string') {
        const elem = document.getElementById(canvas);
        if (elem instanceof HTMLCanvasElement) {
          this.canvas = elem
        }
      } else if (canvas instanceof HTMLCanvasElement) {
        this.canvas = canvas
      }
    }

    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = "remember-me-scene";
      this.canvas.style.width = '100vw';
      this.canvas.style.height = '100vh';
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0px';
      this.canvas.style.left = '0px'
      this.container?.appendChild(this.canvas);
    }

  }

  private _resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height
  }

}

const stage = new Stage()

stage.render()