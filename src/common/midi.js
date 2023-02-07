import { merge } from 'lodash'
import JZZ from 'jzz'

export function midi2Object(midi) {
  let obj

  if (midi.isNoteOn() || midi.isNoteOff()) {
    // Note on/off event
    obj = {
      0: midi[0],
      1: midi[1],
      2: midi[2]
    }
  } else if (midi.isSMF()) {
    // SMF event
    obj = {
      ff: midi.ff,
      dd: midi.dd
    }
  }

  if (obj) {
    merge(obj, {
      _off: midi._off,
      tt: midi.tt
    })
  }

  return obj
}

export function object2Midi(obj) {
  let midi

  if (obj[0] !== undefined) {
    // Note on/off event
    midi = JZZ.MIDI(obj[0], obj[1], obj[2])
  } else if (obj.ff !== undefined) {
    // SMF event
    midi = JZZ.MIDI.smf(obj.ff, obj.dd)
  }

  if (midi) {
    midi._off = obj._off
    midi.tt = obj.tt
  }

  return midi
}
