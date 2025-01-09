import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";

const initialState = {
  inquiries: [],
  inquiriesCount : 0,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  inquiryData: {}
};

export const fetchInquiryListRedux = createAsyncThunk(
  "enquiry/fetchInquiryListRedux",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiRequests.getRequest(url)
      console.log('response', response)
      return response.result.data; 
    } catch (error) {
      // Log and pass the error
      console.log("API error:", error);
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchInquiryDataRedux = createAsyncThunk(
  "invoice/fetchInquiryDataRedux",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests.getRequest(`enquiry/get-specific-enquiry-details/${values?.enquiry_id}`, values)
      return response.result 
    } catch (error) {
      // Log and pass the error
      console.log("API error:", error);
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);


export const inquirySlice = createSlice({
  name: "inquiry",
  initialState,
  reducers: {
    restInquiryData: (state) => {
      state.inquiries = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInquiryListRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInquiryListRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.inquiries = action?.payload?.data;
        state.inquiriesCount = action?.payload?.totalItems;
      })
      .addCase(fetchInquiryListRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchInquiryDataRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInquiryDataRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.inquiryData = action?.payload;
      })
      .addCase(fetchInquiryDataRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

export const { restInquiryData } = inquirySlice.actions;

export default inquirySlice.reducer;