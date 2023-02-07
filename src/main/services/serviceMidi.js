import { BrowserWindow, ipcMain } from 'electron'
import JZZ from 'jzz'
import JzzMidiSmfPlugin from 'jzz-midi-smf'

JzzMidiSmfPlugin(JZZ)

const midiOut = JZZ().openMidiOut()
let player

ipcMain.handle('midi/player/init', (_event, dataArray) => {
  const win = BrowserWindow.getAllWindows()[0]
  const smf = new JZZ.MIDI.SMF(Buffer.from(dataArray))
  player = smf.player()
  player.connect((event) => {
    win.webContents.send('midi/event', [...event])
    midiOut.send(event)
  })
})

ipcMain.handle('midi/player/play', () => {
  player.play()
})

ipcMain.handle('midi/player/pause', () => {
  player.pause()
})

ipcMain.handle('midi/player/resume', () => {
  player.resume()
})

ipcMain.handle('midi/player/stop', () => {
  player.stop()
})

ipcMain.handle('midi/player/getDurationMS', () => {
  return player.durationMS()
})

ipcMain.handle('midi/player/getPositionMS', () => {
  return player.positionMS()
})

ipcMain.handle('midi/player/tick2ms', (_event, tick) => {
  return player.tick2ms(tick)
})

ipcMain.handle('midi/player/ms2tick', (_event, ms) => {
  return player.ms2tick(ms)
})
