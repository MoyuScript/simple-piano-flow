import { createSlice } from '@reduxjs/toolkit'

const sliceMidi = createSlice({
  name: 'midi',
  initialState: {
    name: null,
    fileData: null
  },
  reducers: {
    setFileData(state, action) {
      state.fileData = action.payload
    },
    setName(state, action) {
      state.name = action.payload
    }
  }
})

export default sliceMidi
