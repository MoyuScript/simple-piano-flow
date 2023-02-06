import * as PIXI from 'pixi.js'
import gsap from 'gsap'
import Piano from './objects/Piano'
import JZZ from 'jzz'
import FlorBar from './objects/FlowBar'

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

    this.$piano = new Piano()
    this.$piano.y = 550
    this.stage.addChild(this.$piano)

    this.$flowBarMap = new Map()

    this.$_listenEvents()
  }

  $_listenEvents() {
    window.electron.ipcRenderer.on('midi/event', (_event, data) => {
      const midi = JZZ.MIDI(data)

      if (midi.isNoteOn()) {
        const note = midi.getNote()
        this.$piano.$press(note)

        if (!this.$flowBarMap.has(note)) {
          const x = this.$piano.getChildByName(Piano.$buildKeyName(note)).x
          const flowBar = new FlorBar({ x: x + 6 })
          this.$flowBarMap.set(note, flowBar)
          this.stage.addChild(flowBar)
        }

      } else if (midi.isNoteOff()) {
        const note = midi.getNote()
        this.$piano.$release(note)

        const flowBar = this.$flowBarMap.get(note)
        if (flowBar) {
          flowBar.$end()
          this.$flowBarMap.delete(note)
        }
      }
    })
  }
}
