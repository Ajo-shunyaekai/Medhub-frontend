import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";
 
const initialState = {
  user: {},
  subscriptionSelected: {},
  subscriptionDetails: {},
  subscribedPlanDetails: {},
};
 
export const fetchUserData = createAsyncThunk(
  "subscription/fetchUserData",
  async (obj, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.getRequest2({
        url: `/auth/${obj?.id}`,
        userType: obj?.type,
      });
 
      const { data } = await response;
      return data; // Return the actual user data or fallback
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);
 
export const fetchCurrentSubscription = createAsyncThunk(
  "subscription/fetchCurrentSubscription",
  async (obj, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.getRequest2({
        url: `${process.env.REACT_APP_API_URL}subscription/${obj?.id}`,
        userType: obj?.type,
      });
 
      const { data } = await response;
      return data; // Return the actual user data or fallback
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);
 
export const createSubscriptionSession = createAsyncThunk(
  "subscription/createSubscriptionSession",
  async (obj, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.getRequest2({
        url: `${process.env.REACT_APP_API_URL}subscription/create-subscription`,
        userType: obj?.userType,
        obj,
      });
 
      if (response?.data) {
        window.location.href = response?.data?.url;
      }
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);
 
export const saveSubscriptionPayment = createAsyncThunk(
  "subscription/saveSubscriptionPayment",
  async (obj, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.getRequest2({
        url: `${process.env.REACT_APP_API_URL}subscription/save-payment`,
        userType: obj?.userType,
        obj,
      });
      return response?.data?.subscriptionDetails;
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);
 
export const sendSubscriptionPaymentEmail = createAsyncThunk(
  "subscription/sendSubscriptionPaymentEmail",
  async (obj, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.getRequest2({
        url: `${process.env.REACT_APP_API_URL}subscription/send-confimation-mail`,
        userType: obj?.userType,
        obj: obj?.formData,
        contentType: "multipart/form-data",
      });
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);
 
export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    updateSubscriptionSelected: (state, action) => {
      state.subscriptionSelected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.user = action?.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentSubscription.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.subscribedPlanDetails = action?.payload;
      })
      .addCase(fetchCurrentSubscription.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveSubscriptionPayment.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(saveSubscriptionPayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.subscriptionDetails = action?.payload;
      })
      .addCase(saveSubscriptionPayment.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      });
  },
});
 
export const { updateSubscriptionSelected } = subscriptionSlice.actions;
 
export default subscriptionSlice.reducer;