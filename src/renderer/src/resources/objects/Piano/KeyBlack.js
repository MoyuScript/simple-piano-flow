import Key from './Key'

export default class KeyBlack extends Key {
  static $WIDTH = 17

  constructor() {
    super({
      color: 0x000000,
      width: KeyBlack.$WIDTH,
      height: 80
    })

    this.zIndex = 2
  }
}
