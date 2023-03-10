import * as PIXI from 'pixi.js'
import JZZ from 'jzz'
import JazzSmfPlugin from 'jzz-midi-smf'
import { inRange } from 'lodash'
import gsap from 'gsap'
import { object2Midi } from '../../../../common/midi'
import event, { EVENT_IMPORT_MIDI_FILE } from '../../event'
import Color from 'color'

JazzSmfPlugin(JZZ)

export default class FlowBar extends PIXI.Container {
  constructor({ pianoObject, scale = 1 }) {
    super()
    this.$pianoObject = pianoObject
    this.$scale = scale
    this.$midiFile = null

    event.on(EVENT_IMPORT_MIDI_FILE, (dataArray) => {
      this.$midiFile = JZZ.MIDI.SMF(new Uint8Array(dataArray))
      this.y = 0
      this.$_renderNote()
    })
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
        const channel = event.getChannel()
        notes.push({ noteNumber, duration, tick, channel })
      }
    })

    const objects = notes.map(({ noteNumber, duration, tick, channel }) => {
      const obj = new PIXI.Graphics()
      const keyObject = this.$pianoObject.$keyObjectMap.get(noteNumber)

      const color = Color(`hsl(${(channel / 15) * 360}, 100%, 50%)`).rgbNumber()
      obj.beginFill(color)
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
    let speed = null
    let delayBeforeStart = 0

    const updateSpeed = (midi) => {
      const bpm = midi.getBPM()
      const ppqn = this.$midiFile.ppqn

      const msPerTick = 60000 / (bpm * ppqn)
      speed = (1 / msPerTick) * this.$scale
      delayBeforeStart = this.$pianoObject.y / speed
    }

    // Find first tempo event
    let firstTempoEvent

    this.$midiFile.some((track) => {
      return track.some((event) => {
        if (event.isTempo()) {
          firstTempoEvent = event
          return true
        }
      })
    })
    if (firstTempoEvent) {
      updateSpeed(firstTempoEvent)
    }

    const handleMidiEvent = (_event, data) => {
      const midi = object2Midi(data)

      if (midi.isTempo()) {
        updateSpeed(midi)
      }
    }

    const handleTick = (_currentTime, deltaTime) => {
      this.y += speed * deltaTime
    }
    gsap.ticker.add(handleTick)

    window.electron.ipcRenderer.on('midi/event', handleMidiEvent)

    window.electron.ipcRenderer.once('midi/end', () => {
      window.electron.ipcRenderer.removeListener('midi/event', handleMidiEvent)
      gsap.ticker.remove(handleTick)
      console.log('end')
    })

    setTimeout(() => {
      window.electron.ipcRenderer.invoke('midi/play')
    }, delayBeforeStart)
  }
}
