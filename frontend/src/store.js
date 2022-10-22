import { configureStore } from "@reduxjs/toolkit";
import activeReducer from "./slices/active";
import coinReducer from "./slices/coin";

export default configureStore({
    reducer: {
        active: activeReducer,
        coin: coinReducer,
    }
})