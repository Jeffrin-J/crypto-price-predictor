import { configureStore } from "@reduxjs/toolkit";
import activeReducer from "./slices/active";
import coinReducer from "./slices/coin";
import loginReducer from "./slices/login";

export default configureStore({
    reducer: {
        active: activeReducer,
        coin: coinReducer,
        login: loginReducer,
    }
})