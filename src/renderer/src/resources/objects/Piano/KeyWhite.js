import Key from './Key'

export default class KeyWhite extends Key {
  static $WIDTH = 22.65

  constructor() {
    super({
      color: 0xffffff,
      pressColor: 0xff0000,
      width: KeyWhite.$WIDTH,
      height: 150
    })

    this.zIndex = 1
  }
}
