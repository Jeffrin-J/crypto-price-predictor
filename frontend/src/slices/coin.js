import { createSlice } from "@reduxjs/toolkit";

export const coin = createSlice({
    name: "coin",
    initialState: {
      value: -1,
    },
    reducers: {
      setCoin: (state, action) => {
        state.value = action.payload;
      },
    },
  });
  
  export const { setCoin } = coin.actions;
  
  export default coin.reducer;