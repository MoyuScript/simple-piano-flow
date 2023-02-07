import * as PIXI from 'pixi.js'
import JZZ from 'jzz'
import JazzSmfPlugin from 'jzz-midi-smf'
import { inRange } from 'lodash'
import gsap from 'gsap'

JazzSmfPlugin(JZZ)

export default class FlowBar extends PIXI.Container {
  constructor({ pianoObject, scale = 1 }) {
    super()
    this.$pianoObject = pianoObject
    this.$scale = scale
    this.$midiFile = null
  }

  $setMidiFile(dataArray) {
    this.$midiFile = JZZ.MIDI.SMF(new Uint8Array(dataArray))
    console.log(this.$midiFile)
    this.$_renderNote()
  }

  async $_renderNote() {
    const midiFile = this.$midiFile
    // Combine all tracks into one
    const track = [...midiFile[0]]
    midiFile.slice(1).forEach((t) => {
      track.push(...t)
    })

    // Sort by time
    track.sort((a, b) => a._off - b._off)

    // Transform to note number and duration
    const notes = []
    const noteOnMap = new Map()

    track.map((event) => {
      if (event.isNoteOn()) {
        const noteNumber = event.getNote()
        if (!inRange(noteNumber, 21, 109)) return
        noteOnMap.set(noteNumber, event.tt)
      } else if (event.isNoteOff()) {
        const noteNumber = event.getNote()
        if (!inRange(noteNumber, 21, 109)) return
        const duration = event.tt - noteOnMap.get(noteNumber)
        const tick = event.tt
        notes.push({ noteNumber, duration, tick })
      }
    })

    const objects = notes.map(({ noteNumber, duration, tick }) => {
      const obj = new PIXI.Graphics()
      const keyObject = this.$pianoObject.$keyObjectMap.get(noteNumber)

      obj.beginFill(0x00ff00)
      obj.drawRect(keyObject.x + 5, -tick * this.$scale, 10, duration * this.$scale)
      obj.endFill()
      return obj
    })

    // Append to this
    this.removeChildren()
    this.addChild(...objects)

    this.$start()
  }

  async $start() {
    // px/ms
    let speed = 1

    window.electron.ipcRenderer.on('midi/event', (_event, data) => {
      const midi = JZZ.MIDI(data)

      if (midi.isTempo()) {
        const bpm = midi.getBPM()
        const ppqn = this.$midiFile.ppqn

        const msPerTick = 60000 / (bpm * ppqn)
        speed = (1 / msPerTick) * this.$scale
        console.log({ bpm, ppqn, msPerTick, speed })
      }
    })

    window.electron.ipcRenderer.invoke('midi/player/play')

    gsap.ticker.add((_currentTime, deltaTime) => {
      this.y += speed * deltaTime
    })
  }
}
