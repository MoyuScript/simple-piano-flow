import { BrowserWindow, ipcMain } from 'electron'
import JZZ from 'jzz'
import JzzMidiSmfPlugin from 'jzz-midi-smf'
import { midi2Object } from '../../common/midi'

JzzMidiSmfPlugin(JZZ)

const midiOut = JZZ().openMidiOut()
let player

ipcMain.handle('midi/init', (_event, dataArray) => {
  const win = BrowserWindow.getAllWindows()[0]
  const smf = new JZZ.MIDI.SMF(Buffer.from(dataArray))
  player = smf.player()
  player.connect((event) => {
    midiOut.send(event)
    const payload = midi2Object(event)

    if (payload) {
      win.webContents.send('midi/event', payload)
    }
  })

  player.onEnd = () => {
    win.webContents.send('midi/end')
  }
})

ipcMain.handle('midi/play', () => {
  player.play()
})

ipcMain.handle('midi/pause', () => {
  player.pause()
})

ipcMain.handle('midi/resume', () => {
  player.resume()
})

ipcMain.handle('midi/stop', () => {
  player.stop()
})

ipcMain.handle('midi/getDurationMS', () => {
  return player.durationMS()
})

ipcMain.handle('midi/getPositionMS', () => {
  return player.positionMS()
})

ipcMain.handle('midi/tick2ms', (_event, tick) => {
  return player.tick2ms(tick)
})

ipcMain.handle('midi/ms2tick', (_event, ms) => {
  return player.ms2tick(ms)
})
