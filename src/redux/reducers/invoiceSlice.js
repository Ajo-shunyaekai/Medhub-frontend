import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";
 
const initialState = {
  invoices: [],
  invoiceCount : 0,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  invoiceData: {},
};
 
export const fetchInvoiceListRedux = createAsyncThunk(
  "invoice/fetchInvoiceListRedux",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests.postRequest('order/get-all-invoice-list', values)
      return response.result; 
    } catch (error) {
      // Log and pass the error
      console.log("API error:", error);
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);
 
export const fetchInvoiceDataRedux = createAsyncThunk(
  "invoice/fetchInvoiceDataRedux",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests.getRequest(`invoice/get-specific-invoice-details/${values?.invoice_id}`, values)
      return response.result 
    } catch (error) {
      // Log and pass the error
      console.log("API error:", error);
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);
 
export const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    resteInvoivceData: (state) => {
      state.invoices = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoiceListRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInvoiceListRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.invoices = action?.payload?.data;
        state.invoiceCount = action?.payload?.totalItems;
      })
      .addCase(fetchInvoiceListRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchInvoiceDataRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInvoiceDataRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.invoiceData = action?.payload;
      })
      .addCase(fetchInvoiceDataRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});
 
export const { resteInvoivceData } = invoiceSlice.actions;
 
export default invoiceSlice.reducer;