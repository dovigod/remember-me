import RAPIER from '@dimforge/rapier3d-compat';
import type { WebGLRenderer, Clock, Scene } from 'three';

export interface Context {
  threeContext: ThreeContext;
  physicsContext: PhysicsContext;
}
export interface ThreeContext {
  renderer: WebGLRenderer,
  scene: Scene,
  canvas: HTMLCanvasElement,
  frame: number,
  clock: Clock,
  dimension: {
    width: number,
    height: number
  }
}

export interface PhysicsContext {
  world: RAPIER.World
}