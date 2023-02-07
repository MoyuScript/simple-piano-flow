import Key from './Key'

export default class KeyWhite extends Key {
  static $WIDTH = 22.65

  constructor() {
    super({
      color: 0xffffff,
      width: KeyWhite.$WIDTH,
      height: 150
    })

    this.zIndex = 1
  }
}
