import { createSlice } from "@reduxjs/toolkit";

export const active = createSlice({
    name: "active",
    initialState: {
      value: 'coin_list',
    },
    reducers: {
      setActive: (state, action) => {
        state.value = action.payload;
      },
    },
  });
  
  export const { setActive } = active.actions;
  
  export default active.reducer;