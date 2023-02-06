/* eslint-disable react/prop-types */
import Layer from '../components/Layer'

export default function LayerUI() {
  const handleClick = () => {
    const file = document.createElement('input')
    file.type = 'file'
    file.accept = '.mid'
    file.onchange = () => {
      if (file.files.length === 0) return

      const path = file.files[0].path
      window.electron.ipcRenderer.invoke('midi/play', path)
    }
    file.click()
  }
  return (
    <Layer>
      <button className="bg-white p-2" onClick={handleClick}>Import</button>
    </Layer>
  )
}
