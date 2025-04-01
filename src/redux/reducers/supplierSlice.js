import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";

const initialState = {
  suppliers: [],
  supplierCount : 0,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  supplierData: {}
};

export const fetchSupplierListRedux = createAsyncThunk(
  "supplier/fetchSupplierListRedux",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiRequests.getRequest(url)
      return response.result.data; 
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchSupplierDataRedux = createAsyncThunk(
  "medicine/fetchSupplierDataRedux",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests.getRequest(`supplier/get-specific-supplier-details/${values?.supplier_id}`, values)
      return response.result 
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    restSupplierData: (state) => {
      state.suppliers = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplierListRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSupplierListRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.suppliers = action?.payload?.data;
        state.supplierCount = action?.payload?.totalItems;
      })
      .addCase(fetchSupplierListRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSupplierDataRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSupplierDataRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.supplierData = action?.payload;
      })
      .addCase(fetchSupplierDataRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

export const { restSupplierData } = supplierSlice.actions;

export default supplierSlice.reducer;