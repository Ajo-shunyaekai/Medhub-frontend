import { combineReducers } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";

// import reducers
import userReducer from "./reducers/userDataSlice";
import invoiceReducer from "./reducers/invoiceSlice";
import orderReducer from "./reducers/orderSlice";
import inquiryReducer from "./reducers/inquirySlice";
import medicineReducer from "./reducers/medicineSlice";
import adminReducer from "./reducers/adminSlice";
import bidReducer from "./reducers/bidSlice";
import addressReducer from "./reducers/addressSlice";
import productReducer from "./reducers/productSlice";
import listReducer from "./reducers/listSlice";
import subscriptionReducer from "./reducers/subscriptionSlice";

const rootReducer = combineReducers({
  userReducer,
  addressReducer,
  bidReducer,
  subscriptionReducer,
  adminReducer,
  invoiceReducer,
  orderReducer,
  inquiryReducer,
  medicineReducer,
  productReducer,
  listReducer
});

const store = configureStore({
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
