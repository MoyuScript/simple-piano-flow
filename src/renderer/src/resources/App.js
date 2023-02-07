import * as PIXI from 'pixi.js'
import gsap from 'gsap'
import Piano from './objects/Piano'
import JZZ from 'jzz'
import store from '../redux/store'
import FlowBar from './objects/FlowBar'
import { object2Midi } from '../../../common/midi'
import Color from 'color'

export default class App extends PIXI.Application {
  constructor() {
    super({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1099bb,
      resizeTo: window
    })
    this.ticker.stop()
    gsap.ticker.add((currentTime) => {
      this.ticker.update(currentTime)
    })

    this.stage.sortableChildren = true

    this.$piano = new Piano()
    this.$piano.y = 550
    this.$piano.zIndex = 10
    this.stage.addChild(this.$piano)

    this.$flowBar = new FlowBar({ pianoObject: this.$piano })
    this.stage.addChild(this.$flowBar)

    this.$_listenEvents()
  }

  $_listenEvents() {
    window.electron.ipcRenderer.on('midi/event', (_event, data) => {
      const midi = object2Midi(data)
      if (midi.isNoteOn()) {
        const note = midi.getNote()
        const channel = midi.getChannel()
        const color = Color(`hsl(${(channel / 15) * 360}, 100%, 50%)`).rgbNumber()
        this.$piano.$press(note, color)
      } else if (midi.isNoteOff()) {
        const note = midi.getNote()
        this.$piano.$release(note)
      }
    })
  }
}
