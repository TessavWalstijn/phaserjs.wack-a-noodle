import { ParrotFly } from '../objects/parrot-fly'

export class MainScene extends Phaser.Scene {
  private parrotFly: ParrotFly

  constructor() {
    super({ key: 'MainScene' })
  }

  preload(): void {}

  create(): void {
    this.parrotFly = new ParrotFly({
      scene: this,
      x: 400,
      y: 300,
    })
  }
}
 