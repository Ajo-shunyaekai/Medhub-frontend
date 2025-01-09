import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";

const initialState = {
  address: [],
  addressCount : 0,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  addressData: {}
};

export const fetchAddressListRedux = createAsyncThunk(
  "address/fetchAddressListRedux",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests.postRequest('address/get-all-address-list', values)
      console.log('response', response)
      return response.result.data; 
    } catch (error) {
      // Log and pass the error
      console.log("API error:", error);
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchAddressDataRedux = createAsyncThunk(
  "medicine/fetchAddressDataRedux",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiRequests.getRequest(url)
      return response.result 
    } catch (error) {
      // Log and pass the error
      console.log("API error:", error);
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    restAddressData: (state) => {
      state.address = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressListRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddressListRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.address = action?.payload?.data;
        state.addressCount = action?.payload?.totalItems;
      })
      .addCase(fetchAddressListRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAddressDataRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddressDataRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addressData = action?.payload;
      })
      .addCase(fetchAddressDataRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

export const { restAddressData } = addressSlice.actions;

export default addressSlice.reducer;
