import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import Login from "./login/Login";
import Register from "./register/Register";
import getListProgramCoupon from "./mcoupon/getListProgramCoupon";
import addProgram from "./mcoupon/addProgram";
import user from "./mcoupon/user"
import storeManager from "./store/storeManager";
import employeeManager from "./staff/employeeManager";
import customer from "./customer/customer";
import listAddress from "./customer/listAddress";
import customerType from "./customer/customerType/customerType";
import voucherRedux from "./voucher/voucherRedux";
import sms from "./smsConfig/sms";
import trade from "./trade/trade";
import groupCustomer from "./customer/groupCustomer/groupCustomer";
import customerSee from "./customerSee/customerSee";
import dashboard from "./dashboard/dashboard";
import rankCustomer from "./customer/rankCustomer/rankCustomer";
import storeCustomer from "./customerSee/storeCustomer";


const persistConfig = {
  key: "data",
  storage,
//   whitelist: ["listProductBota"],
};
export const rootReducers = combineReducers({
    Login,
    user,
    Register,
    getListProgramCoupon,
    addProgram,
    storeManager,
    employeeManager,
    customer,
    listAddress,
    customerType,
    rankCustomer,
    storeCustomer,
    voucherRedux,
    sms,
    trade,
    groupCustomer,
    customerSee,
    dashboard
});
const persistedReducer = persistReducer(persistConfig, rootReducers);
export const store = configureStore({
  reducer: { persistedReducer },
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== "production",
});
export const persistor = persistStore(store);
