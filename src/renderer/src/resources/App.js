import * as PIXI from 'pixi.js'
import gsap from 'gsap'
import Piano from './objects/Piano'
import JZZ from 'jzz'
import store from '../redux/store'
import FlowBar from './objects/FlowBar'

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
    this.$_subscribeStore()
  }

  $_subscribeStore() {
    store.subscribe(() => {
      const state = store.getState()
      if (state.midi.fileData) {
        this.$flowBar.$setMidiFile(state.midi.fileData)
      }
    })
  }

  $_listenEvents() {
    window.electron.ipcRenderer.on('midi/event', (_event, data) => {
      const midi = JZZ.MIDI(data)

      if (midi.isNoteOn()) {
        const note = midi.getNote()
        this.$piano.$press(note)
      } else if (midi.isNoteOff()) {
        const note = midi.getNote()
        this.$piano.$release(note)
      }
    })
  }
}
