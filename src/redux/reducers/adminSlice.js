import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  profileEditReqs : [],
  profileEditReqDetail : {},
};

export const fetchProfileEditReqsList = createAsyncThunk(
  "admin/fetchProfileEditReqsList",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiRequests.postRequest(url)
      console.log('response of admin/fetchProfileEditReqsList', response)
      return response?.data; 
    } catch (error) {
      // Log and pass the error
      console.log("API error:", error);
      return rejectWithValue(error?.response || error.message);
    }
  }
);

export const fetchProfileEditReqsDetail = createAsyncThunk(
  "admin/fetchProfileEditReqsDetail",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiRequests.postRequest(url)
      console.log('response of admin/fetchProfileEditReqsDetail', response)
      return response?.data?.[0]; 
    } catch (error) {
      // Log and pass the error
      console.log("API error:", error);
      return rejectWithValue(error?.response || error.message);
    }
  }
);
export const updateProfileEditReqsDetail = createAsyncThunk(
  "admin/updateProfileEditReqsDetail",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests.postRequest(`admin/update-profile-edit-request-details/${values?.id}`,values)
      console.log('response of admin/updateProfileEditReqsDetail', response)
      if(response.code != 200){
        return;
      }
      toast.success(response?.message);
      return response?.data; 
    } catch (error) {
      // Log and pass the error
      console.log("API error:", error);
      return rejectWithValue(error?.response || error.message);
    }
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    restAdminData: (state) => {
      
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileEditReqsList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfileEditReqsList.fulfilled, (state, action) => {
        state.loading = false;
        state.profileEditReqs = action?.payload;
      })
      .addCase(fetchProfileEditReqsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfileEditReqsDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfileEditReqsDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.profileEditReqDetail = action?.payload;
      })
      .addCase(fetchProfileEditReqsDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { restAdminData } = adminSlice.actions;

export default adminSlice.reducer;