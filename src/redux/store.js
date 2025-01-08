import { combineReducers } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";

// import reducers
import userReducer from "./reducers/userDataSlice";
import invoiceReducer from "./reducers/invoiceSlice";
import orderReducer from "./reducers/orderSlice";
import inquiryReducer from "./reducers/inquirySlice";
import medicineReducer from "./reducers/medicineSlice";

const rootReducer = combineReducers({
  userReducer,
  invoiceReducer,
  orderReducer,
  inquiryReducer,
  medicineReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;