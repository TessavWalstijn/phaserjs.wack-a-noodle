import { ImageConstructor } from '../interfaces/image.interface'

export class Lives extends Phaser.GameObjects.Sprite {
  private _oldLives = 11
  private _lives = 11
  private _gameOver = false
  private _restart: () => void

  constructor({ scene, x, y, frame }: ImageConstructor) {
    super(scene, x, y, 'Lives', frame)

    this._initEvents();
    this._initAnimations();

    this.anims.play('Live')
    this.anims.stop()

    this.scene.add.existing(this)
  }

  private _initEvents(): void {
    this.setInteractive()

    this.on('pointerdown', () => {
      if (!this._gameOver) return
      this._restart()
    })
  }

  private _initAnimations(): void {
    this.anims.create({
      key: 'Live',
      frames: this.anims.generateFrameNames('Lives', {
        end: 10,
      }),
      frameRate: 1,
      repeat: 0,
    })
    this.anims.create({
      key: 'GameOver',
      frames: this.anims.generateFrameNames('Lives', {
        start: 10,
        end: 10,
      }),
      frameRate: 12,
      repeat: -1,
    })
  }

  private _updateFrame(): void {
    if (this._lives === this._oldLives) return;

    if (this._lives < this._oldLives) {
      this.anims.nextFrame()
    } else {
      this.anims.previousFrame()
    }
  }

  public add(amount: number, gameOver: () => void): void {
    this._oldLives = this._lives
    this._lives += amount

    if (this._lives > 11) {
      this._lives = 11
    }

    if (this._lives <= 0) {
      gameOver()
    }

    this._updateFrame()
  }

  public gameOver(startGame: () => void): void {
    this.anims.play('GameOver')
    this._gameOver = true
    this._restart = startGame;
  }
}
