import { Lives } from '../objects/lives'
import { WhoopNoodle } from '../objects/whoop-noodle'
import { GameConfig } from './../config'

export class MainScene extends Phaser.Scene {
  private _whoopNoodles: WhoopNoodle[] = []
  private _lives: Lives
  private _timer = 0
  private _nextNoodles: number[] = []
  private _oldNoodles: number[] = []
  private _highScore = 0
  private _score = 0
  private _currentLevel = 0
  private _levels: { t: number; s: number }[] = [
    { t: 2000, s: 10 },
    { t: 1800, s: 18 },
    { t: 1600, s: 25 },
    { t: 1300, s: 32 },
    { t: 1000, s: 40 },
    { t: 900, s: 65 },
    { t: 800, s: 108 },
    { t: 700, s: 180 },
    { t: 600, s: 300 },
    { t: 500, s: 500 },
    { t: 400, s: Infinity },
  ]
  private _text: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'MainScene' })
  }

  private _setRandomNr(): void {
    const max = this._whoopNoodles.length
    for (let i = 0; i < max; i += 1) {
      this._nextNoodles.push(i)
    }

    this._nextNoodles = this._nextNoodles.sort(() => Math.random() - 0.5)
  }

  private _getRandomNr(): number {
    const noodle = this._nextNoodles.shift()
    this._oldNoodles.push(noodle)

    if (this._nextNoodles.length === 0) {
      this._nextNoodles = this._oldNoodles.sort(() => Math.random() - 0.5)
      this._oldNoodles = []
    }

    return noodle
  }

  private _upRandomNoodle(): void {
    const randomNoodle = this._getRandomNr()
    const currentNoodle = this._whoopNoodles[randomNoodle]

    currentNoodle.show()
  }

  private _updateScore(): void {
    this._text.setText(`\n  high score: ${this._highScore}
                      \n  score: ${this._score}
                      \n  level: ${
                        this._currentLevel > 9 ? 'max' : this._currentLevel + 1
                      }`)
    this._score += 1

    if (this._score > this._highScore) {
      localStorage.setItem('wack-a-noodle-high-score', `${this._score}`)
    }

    if (this._score > this._levels[this._currentLevel].s) {
      this._currentLevel += 1
    }
  }

  private _updateLive(amount: number): void {
    this._lives.add(amount, () => {
      this._gameOver()
    })
  }

  private _gameOver(): void {
    localStorage.setItem('wack-a-noodle-score', `${this._score}`)
    localStorage.setItem('wack-a-noodle-level', `${this._currentLevel}`)

    this.scene.start('GameOver')
  }

  create(): void {
    const width = GameConfig.width as number
    const height = GameConfig.height as number

    this._highScore = parseInt(localStorage.getItem('wack-a-noodle-high-score'), 10) || 0

    this._text = this.add.text(0, 0, '', {
      fontFamily: '"Share Tech Mono"',
    })
    this._updateScore()

    this._lives = new Lives({
      scene: this,
      x: width / 2,
      y: height / 2 - 128,
    })

    const rows = [3, 4, 3]
    for (let i = 0; i < 3; i += 1) {
      const max = rows[i]
      for (let j = 0; j < max; j += 1) {
        this._whoopNoodles.push(
          new WhoopNoodle({
            scene: this,
            x: j * 64 + width / 2 - (max * 64) / 2 + 32,
            y: i * 64 + height / 2 - 64,
            upScore: () => {
              this._updateScore()
            },
            takeLive: () => {
              this._updateLive(-1)
            },
          }),
        )
      }
    }

    this._setRandomNr()
  }

  update(time: number, delta: number): void {
    this._timer += delta
    const timeCap = this._levels[this._currentLevel].t
    while (this._timer > timeCap) {
      this._timer -= timeCap

      this._upRandomNoodle()
    }
  }
}
