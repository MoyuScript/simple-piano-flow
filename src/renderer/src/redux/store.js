import { configureStore } from '@reduxjs/toolkit'
import sliceMidi from './slices/midi'

const store = configureStore({
  reducer: {
    [sliceMidi.name]: sliceMidi.reducer
  }
})

export default store
