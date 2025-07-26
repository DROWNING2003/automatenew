// src/declarations.d.ts
declare module 'pixi-live2d-display' {
    import * as PIXI from 'pixi.js';
    export class Live2DModel extends PIXI.Container {
      static registerTicker(Ticker: typeof PIXI.Ticker) {
        throw new Error("Method not implemented.");
      }
      static from(modelPath: string): Promise<Live2DModel>;
      motion(name: string): void;
      hitTest(areaName: string, x: number, y: number): boolean;
    }
  }
  