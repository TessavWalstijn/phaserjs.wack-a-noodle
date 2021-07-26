import { ImageConstructor } from '../interfaces/image.interface'

export class ParrotFly extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  constructor(aParams: ImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, 'parrot-fly', aParams.frame)

    this._initAnimations();
    this.anims.play('flyAnimation');

    this.scene.add.existing(this)
  }

  private _initAnimations(): void {
    this.scene.anims.create({
      key: 'flyAnimation',
      frames: this.scene.anims.generateFrameNames('parrot-fly', {
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    })
  }
}
