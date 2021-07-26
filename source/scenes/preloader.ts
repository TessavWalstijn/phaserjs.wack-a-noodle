type NamesAndPaths = string[][]
enum loadTypes {
  audio = 'AUDIO',
  image = 'IMAGE',
}

export class Preloader extends Phaser.Scene {
  private _loadingBarHeight: number = 4
  private _origin: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, this._loadingBarHeight)
  private _loadingBar: Phaser.GameObjects.Graphics
  private _progressBar: Phaser.GameObjects.Graphics
  private _loadingBarColor: number = 0x12cefc
  private _progressBarColor: number = 0x006c96

  constructor() {
    super({ key: 'Preloader' })
  }

  private _loadAudioClips(namesAndPaths: NamesAndPaths): void {
    for (const [name, path] of namesAndPaths) {
      this._loadItem(name, path, loadTypes.audio)
    }
  }

  private _loadImages(namesAndPaths: NamesAndPaths): void {
    for (const [name, path] of namesAndPaths) {
      this._loadItem(name, path, loadTypes.image)
    }
  }

  private _loadItem(name: string, path: string, type: loadTypes): void {
    switch (type) {
      case loadTypes.audio:
        this.load.audio(name, [`${path}.ogg`, `${path}.mp3`])
        break
      case loadTypes.image:
        this.load.image(name, `${path}.png`)
        break
    }
  }

  private _createLoadingbar(): void {
    this._loadingBar = this.add.graphics()
    this._loadingBar.fillStyle(this._loadingBarColor, 1)
    this._loadingBar.fillRect(
      this._origin.x,
      this._origin.y - this._loadingBarHeight,
      this.cameras.main.width,
      this._loadingBarHeight,
    )
    this._progressBar = this.add.graphics()
  }

  private _initLoaderEvents(): void {
    this.load.on('progress', (value: number) => {
      console.log(value)
      this._progressBar.clear()
      this._progressBar.fillStyle(this._progressBarColor, 1)
      this._progressBar.fillRect(
        this._origin.x,
        this._origin.y - this._loadingBarHeight,
        this.cameras.main.width * value,
        this._loadingBarHeight,
      )
      this._loadingBar.clear()
      this._loadingBar.fillStyle(this._loadingBarColor, 1)
      this._loadingBar.fillRect(
        this._origin.x,
        this._origin.y - this._loadingBarHeight,
        this.cameras.main.width,
        this._loadingBarHeight,
      )
    })

    this.load.on('complete', () => {
      this._progressBar.destroy()
      this._loadingBar.destroy()
    })
  }

  public preload(): void {
    this._createLoadingbar()
    this._initLoaderEvents()

    this.load.spritesheet('parrot-fly', '../assets/images/ParrotFly.png', {
      frameWidth: 400,
      frameHeight: 400,
      endFrame: 4,
    })
  }

  public create(): void {
    this.scene.start('MainScene')
  }
}
