import * as PIXI from 'pixi.js'
import gsap from 'gsap'

export default class FlorBar extends PIXI.Graphics {
  constructor({ x, initialY = 550, color = 0x00ff00, width = 10, scale = 100 }) {
    super()
    this.$x = x
    this.$initialY = initialY
    this.$color = color
    this.$width = width
    this.$scale = scale

    this.$_update = this.$_update.bind(this)
    this.$_isStarted = true
    this.$_startTime = gsap.ticker.time
    this.$_endTime = 0
    gsap.ticker.add(this.$_update)
  }

  $_update(currentTime) {
    const deltaTime = currentTime - this.$_startTime
    const height = (this.$_isStarted ? deltaTime : this.$_endTime - this.$_startTime) * this.$scale

    this.clear()
    this.beginFill(this.$color)
    this.drawRect(this.$x, this.$initialY - deltaTime * this.$scale, this.$width, height)
    this.endFill()
  }

  $end() {
    this.$_isStarted = false
    this.$_endTime = gsap.ticker.time
  }
}
