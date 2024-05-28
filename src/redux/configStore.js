import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import Login from "./login/Login";
import Register from "./register/Register";
import dashboard from "./dashboard/dashboard";

const persistConfig = {
  key: "data",
  storage,
  //   whitelist: ["listProductBota"],
};
export const rootReducers = combineReducers({
  Login,
  Register,
  dashboard,
});
const persistedReducer = persistReducer(persistConfig, rootReducers);
export const store = configureStore({
  reducer: { persistedReducer },
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== "production",
});
export const persistor = persistStore(store);
