import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";
import { toast } from "react-toastify";
 
const initialState = {
  loading: false,
  lists : [],
//   supplierProductList: [],
//   otherSupplierList: [],
//   productDetail : {},
};
 
export const fetchsLists = createAsyncThunk(
  "list/fetchsLists",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiRequests.postRequest(url)
      return response?.data; 
    } catch (error) {
      // Log and pass the error
      console.log("API error:", error);
      return rejectWithValue(error?.response || error.message);
    }
  }
);

export const addToList = createAsyncThunk(
    "list/addToList",
    async (values, { rejectWithValue }) => {
      try {
        const response = await apiRequests?.postRequest(
          `buyer/add-to-list`,
          values
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

  export const listSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
      restAdminData: (state) => {
        
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchsLists.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchsLists.fulfilled, (state, action) => {
          state.loading = false;
          state.lists = action?.payload;
        })
        .addCase(fetchsLists.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        
    },
  });
   
  export const { restAdminData } = listSlice.actions;
   
  export default listSlice.reducer;
 