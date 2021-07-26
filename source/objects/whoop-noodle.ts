import { ImageConstructor } from '../interfaces/image.interface'

interface Props extends ImageConstructor {
  upScore: () => void
  takeLive: () => void
}

export class WhoopNoodle extends Phaser.GameObjects.Sprite {
  private _clickable: boolean = false
  private _upScore: () => void
  private _takeLive: () => void
  private _emitter: Phaser.GameObjects.Particles.ParticleEmitter

  constructor({ scene, x, y, frame, upScore, takeLive }: Props) {
    super(scene, x, y, 'WhoopNoodle', frame)

    this._upScore = upScore
    this._takeLive = takeLive

    this.scene.add.existing(this)

    this._initAnimations()
    this._initHitParticles()
    this._initEvents()

    this.anims.play('Idle')
  }

  private _initHitParticles(): void {
    const particles = this.scene.add.particles('Star')

    this._emitter = particles.createEmitter({
      speed: 20,
      scale: { start: 1, end: 0 },
      frequency: 1,
      gravityY: 50,
      followOffset: new Phaser.Math.Vector2(0, -64),
    })

    this._emitter.stop()
  }

  private _initAnimations(): void {
    this.anims.create({
      key: 'Idle',
      frames: this.scene.anims.generateFrameNames('WhoopNoodle', {
        start: 19,
        end: 19,
      }),
      frameRate: 12,
      repeat: -1,
    })
    this.anims.create({
      key: 'Up',
      frames: this.scene.anims.generateFrameNames('WhoopNoodle', {
        end: 19,
      }),
      frameRate: 12,
      repeat: 0,
    })
    this.anims.create({
      key: 'Hit',
      frames: this.scene.anims.generateFrameNames('WhoopNoodleHit', {
        end: 11,
      }),
      frameRate: 12,
      repeat: 0,
    })
  }

  private _initEvents(): void {
    this.setInteractive()

    this.on('pointerdown', ({ position }: { position: Phaser.Math.Vector2 }) => {
      if (!this._clickable) return

      this._upScore()
      this._clickable = false
      this.anims.play('Hit')
      this._emitter.emitParticle(5, position.x, position.y)
    })

    this.on(
      'animationcomplete',
      (event: Phaser.Types.Animations.Animation) => {
        switch (event.key) {
          case 'Hit':
            this._emitter.stop()
            break
          case 'Up':
            this._takeLive()
            break
        }
        this._clickable = false
        this.anims.play('Idle')
      },
      this,
    )
  }

  public show(): void {
    this._clickable = true
    this.anims.play('Up')
  }
}
