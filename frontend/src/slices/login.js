import { createSlice } from "@reduxjs/toolkit";

export const login = createSlice({
    name: "login",
    initialState: {
      value: false,
    },
    reducers: {
      setLogin: (state, action) => {
        state.value = action.payload;
      },
    },
  });
  
  export const { setLogin } = login.actions;
  
  export default login.reducer;