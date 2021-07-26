import { MainScene, Preloader } from './scenes/'

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'phaser3.webpack-boilerplate',
  url: '',
  version: '1.0.0',
  width: 800,
  height: 600,
  backgroundColor: 0x2d2d2d,
  type: Phaser.AUTO,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [Preloader, MainScene],
}
