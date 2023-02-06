import { BrowserWindow, ipcMain } from 'electron'
import JZZ from 'jzz'
import JzzMidiSmfPlugin from 'jzz-midi-smf'
import fs from 'fs'

JzzMidiSmfPlugin(JZZ)

const midiOut = JZZ().openMidiOut()

ipcMain.handle('midi/play', (_event, path) => {
  const win = BrowserWindow.getAllWindows()[0]
  fs.readFile(path, 'binary', (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    const smf = new JZZ.MIDI.SMF(data)
    const player = smf.player()
    player.connect((event) => {
      if (event.isNoteOn() || event.isNoteOff()) {
        win.webContents.send('midi/event', [...event])
      }
      midiOut.send(event)
    })
    player.play()
  })
})
