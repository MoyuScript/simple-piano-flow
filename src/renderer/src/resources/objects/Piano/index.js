import * as PIXI from 'pixi.js'
import { range } from 'lodash'
import KeyWhite from './KeyWhite'
import KeyBlack from './KeyBlack'
import Color from 'color'

export default class Piano extends PIXI.Container {
  constructor() {
    super()

    const keys = range(21, 109).map((noteNumber) => {
      const key = Piano.$isWhiteKey(noteNumber)
        ? Piano.$_createWhiteKey(noteNumber)
        : Piano.$_createBlackKey(noteNumber)

      key.name = Piano.$buildKeyName(noteNumber)
      return key
    })
    this.addChild(...keys)
    this.sortableChildren = true

    const background = Piano.$_createBackground()
    this.addChild(background)
  }

  $press(noteNumber) {
    const key = this.getChildByName(Piano.$buildKeyName(noteNumber))
    key.$press()
  }

  $release(noteNumber) {
    const key = this.getChildByName(Piano.$buildKeyName(noteNumber))
    key.$release()
  }

  static $buildKeyName(noteNumber) {
    return `note-${noteNumber}`
  }

  static $_createBackground() {
    const background = new PIXI.Graphics()
    background.beginFill(Color.hsl(0, 0, 40).rgbNumber())
    background.drawRect(0, 0, window.innerWidth, 150)
    background.endFill()
    return background
  }

  static $_createWhiteKey(noteNumber) {
    const key = new KeyWhite()
    const index = [0, 2, 4, 5, 7, 9, 11].indexOf(noteNumber % 12)
    const octave = Piano.$getOctave(noteNumber)
    const position = index + octave * 7
    key.x = (position - 5) * (KeyWhite.$WIDTH + 2)
    return key
  }

  static $_createBlackKey(noteNumber) {
    const key = new KeyBlack()
    const octave = Piano.$getOctave(noteNumber)
    const index = [1, 3, 6, 8, 10].indexOf(noteNumber % 12)
    const positionMap = [-0.1, 1.1, 2.9, 4, 5.1]
    const position = positionMap[index] + octave * 7
    key.x = (position - 5) * (KeyWhite.$WIDTH + 2) + 15
    return key
  }

  static $isWhiteKey(noteNumber) {
    const note = noteNumber % 12
    return [0, 2, 4, 5, 7, 9, 11].includes(note)
  }

  static $getOctave(noteNumber) {
    return Math.floor(noteNumber / 12) - 1
  }
}
