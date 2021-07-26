import 'Phaser'
import { GameConfig } from './config'
import debounce from './utils/debounce'

let game: Game | undefined

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config)
  }
}

const scaleCanvas = () => {
  const resize = debounce(() => {
    location.reload()
  }, 1000)

  resize()
}

window.addEventListener('load', () => {
  game = new Game(GameConfig)
})

window.addEventListener('resize', scaleCanvas)
