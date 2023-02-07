/* eslint-disable react/prop-types */
import Layer from '../components/Layer'
import { useSelector, useDispatch } from 'react-redux'
import sliceMidi from '../../redux/slices/midi'

export default function LayerUI() {
  const midiName = useSelector((state) => state.midi.name)
  const dispatch = useDispatch()
  const handleClick = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'MIDI Files',
            accept: {
              'audio/midi': ['.mid', '.midi']
            }
          }
        ]
      })
      const file = await fileHandle.getFile()

      dispatch(sliceMidi.actions.setName(file.name))

      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const dataArray = Array.from(uint8Array)

      await window.electron.ipcRenderer.invoke('midi/player/init', dataArray)
      dispatch(sliceMidi.actions.setFileData(dataArray))

    } catch (err) {
      console.error(err)
      // User canceled the picker
    }
  }
  return (
    <Layer>
      <button className="bg-white p-2" onClick={handleClick}>
        Import
      </button>
      <div className="text-white p-2">{midiName}</div>
    </Layer>
  )
}
