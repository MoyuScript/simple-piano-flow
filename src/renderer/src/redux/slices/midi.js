import { createSlice } from '@reduxjs/toolkit'

const sliceMidi = createSlice({
  name: 'midi',
  initialState: {
    name: null
  },
  reducers: {
    setName(state, action) {
      state.name = action.payload
    }
  }
})

export default sliceMidi
