import Layer from '../components/Layer'
import { useMount } from 'ahooks'
import App from '../../resources/App'
import React from 'react'

export default function LayerCanvas() {
  const ref = React.useRef(null)
  const appRef = React.useRef(null)

  useMount(() => {
    if (appRef.current) return
    appRef.current = new App()
    if (ref.current) {
      ref.current.appendChild(appRef.current.view)
    }
  })

  return <Layer ref={ref}></Layer>
}
