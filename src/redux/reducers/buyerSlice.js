import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";

const initialState = {
  buyers: [],
  buyerCount : 0,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  buyerData: {}
};

export const fetchBuyerListRedux = createAsyncThunk(
  "buyer/fetchBuyerListRedux",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiRequests.postRequest( url)
      return response.result.data; 
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchBuyerDataRedux = createAsyncThunk(
  "medicine/fetchBuyerDataRedux",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests.getRequest(`buyer/get-specific-buyer-details/${values?.buyer_id}`, values)
      return response.result 
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const buyerSlice = createSlice({
  name: "buyer",
  initialState,
  reducers: {
    restBuyerData: (state) => {
      state.buyers = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuyerListRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBuyerListRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.buyers = action?.payload?.data;
        state.buyerCount = action?.payload?.totalItems;
      })
      .addCase(fetchBuyerListRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchBuyerDataRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBuyerDataRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.buyerData = action?.payload;
      })
      .addCase(fetchBuyerDataRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

export const { restBuyerData } = buyerSlice.actions;

export default buyerSlice.reducer;