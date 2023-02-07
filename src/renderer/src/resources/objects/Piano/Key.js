import * as PIXI from 'pixi.js'

export default class Key extends PIXI.Graphics {
  constructor({ color, width, height }) {
    super()
    this.$color = color
    this.$width = width
    this.$height = height
    this.$noteNumber = -1

    this.$release()
  }

  $press(color) {
    this.clear()
    this.beginFill(color)
    this.drawRect(0, 0, this.$width, this.$height)
    this.endFill()
  }

  $release() {
    this.clear()
    this.beginFill(this.$color)
    this.drawRect(0, 0, this.$width, this.$height)
    this.endFill()
  }
}
