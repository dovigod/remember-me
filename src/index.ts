import type { SceneConstructor } from "./types/Scene"
import { debounce } from 'es-toolkit'
class Scene {
  canvas!: HTMLCanvasElement;
  container!: HTMLElement;
  width!: number;
  height!: number;

  constructor({
    container,
    canvas,
  }: SceneConstructor = {}) {

    this._prepareDOM(container, canvas)
    this._resize();
    this.attachListeners()
  }




  /**
   * assign dom elements to member variables.
   * if provided params doesn't fit schema, use defaults
   * 
   * defaults :: 
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
  }

  attachListeners() {
    const self = this;
    window.addEventListener('resize', debounce(this._resize.bind(self), 300));
  }
}

new Scene()