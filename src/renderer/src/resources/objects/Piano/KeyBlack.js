import Key from './Key'

export default class KeyBlack extends Key {
  static $WIDTH = 17

  constructor() {
    super({
      color: 0x000000,
      pressColor: 0xff0000,
      width: KeyBlack.$WIDTH,
      height: 80
    })

    this.zIndex = 2
  }
}
