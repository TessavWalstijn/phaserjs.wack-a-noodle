import { Lives } from '../objects/lives'
import { WhoopNoodle } from '../objects/whoop-noodle'
import { GameConfig } from './../config'

export class GameOver extends Phaser.Scene {
  private _whoopNoodles: WhoopNoodle[] = []
  private _lives: Lives
  private _text: Phaser.GameObjects.Text
  private _highScore = 0
  private _score = 0
  private _currentLevel = 0

  constructor() {
    super({ key: 'GameOver' })
  }

  private _updateScore(): void {
    this._text.setText(`\n  high score: ${this._highScore}
                      \n  your score: ${this._score}
                      \n  your level: ${
                        this._currentLevel > 9 ? 'max' : this._currentLevel + 1
                      }
                      \n  restart by pressing the hearts!`)
  }

  create(): void {
    const width = GameConfig.width as number
    const height = GameConfig.height as number

    this._highScore =
      parseInt(localStorage.getItem('wack-a-noodle-high-score'), 10) || 0
    this._score = parseInt(localStorage.getItem('wack-a-noodle-score'), 10) || 0
    this._currentLevel =
      parseInt(localStorage.getItem('wack-a-noodle-level'), 10) || 0

    this._text = this.add.text(0, 0, '', {
      fontFamily: '"Share Tech Mono"',
    })
    this._updateScore()

    this._lives = new Lives({
      scene: this,
      x: width / 2,
      y: height / 2 - 128,
    })
    this._lives.gameOver(() => {
      this.scene.start('MainScene')
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
            upScore: () => {},
            takeLive: () => {},
          }),
        )
      }
    }
  }
}
