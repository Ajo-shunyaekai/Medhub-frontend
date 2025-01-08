import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";
 
const initialState = {
  orders: [],
  orderCount : 0,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  orderData: {}
};
 
export const fetchOrderListRedux = createAsyncThunk(
  "order/fetchOrderListRedux",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests.postRequest('order/get-all-order-list', values)
      console.log('response', response)
      return response.result.data; 
    } catch (error) {
      // Log and pass the error
      console.log("API error:", error);
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);
 
export const fetchOrderDataRedux = createAsyncThunk(
  "medicine/fetchOrderDataRedux",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests.getRequest(`order/get-specific-order-details/${values?.order_id}`, values)
      return response.result 
    } catch (error) {
      // Log and pass the error
      console.log("API error:", error);
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);
 
export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    restOrderData: (state) => {
      state.orders = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderListRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrderListRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action?.payload?.data;
        state.orderCount = action?.payload?.totalItems;
      })
      .addCase(fetchOrderListRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchOrderDataRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrderDataRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orderData = action?.payload;
      })
      .addCase(fetchOrderDataRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});
 
export const { restOrderData } = orderSlice.actions;
 
export default orderSlice.reducer;