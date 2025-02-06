import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";
import { toast } from "react-toastify";

const initialState = {
  address: [],
  addressCount : 0,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  addressData: {},
  updatedAddress: {},
};

export const fetchAddressListRedux = createAsyncThunk(
  "address/fetchAddressListRedux",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests.postRequest('address/get-address', {buyer_id: values})
      console.log('response', response?.address?.userAddress)
      return response?.address?.userAddress; 
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

export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequest(
        `address/add-address`,
        { ...values?.obj }
      );
      if (response.code !== 200) {
        toast(response?.message, { type: "error" });
        return rejectWithValue(response?.message || "Unknown error");
      }
      const { data, message } = await response;
      toast.success(message)
      
      return data;
      // return rejectWithValue(response?.data?.err);
    } catch (error) {
      //   toast.error("An error occurred while logging in");
      return rejectWithValue(error?.response?.data || "Unknown error");
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
    updateLogisticsAddress: (state, action) => {
      state.updatedAddress = action.payload;
     
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressListRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddressListRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.address = action?.payload;
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

export const { restAddressData, updateLogisticsAddress } = addressSlice.actions;

export default addressSlice.reducer;
