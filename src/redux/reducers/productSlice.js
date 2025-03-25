import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";
import { toast } from "react-toastify";
 
const initialState = {
  loading: false,
  products : [],
  productDetail : {},
};
 
export const fetchProductsList = createAsyncThunk(
  "product/fetchProductsList",
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
 
export const fetchProductDetail = createAsyncThunk(
  "product/fetchProductDetail",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiRequests.postRequest(url)
      return response?.data?.[0]; 
    } catch (error) {
      // Log and pass the error
      console.log("API error:", error);
      return rejectWithValue(error?.response || error.message);
    }
  }
);
export const softDeleteProduct = createAsyncThunk(
  "product/softDeleteProduct",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiRequests.postRequest(url)
      return response?.data?.[0]; 
    } catch (error) {
      // Log and pass the error
      console.log("API error:", error);
      return rejectWithValue(error?.response || error.message);
    }
  }
);
 
export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequestWithFile(
        `product/add`,
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
 
export const editProduct = createAsyncThunk(
  "product/editProduct",
  async ({id,values}, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequestWithFile(
        `product/edit/${id}`,
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
 
export const addBulkProducts = createAsyncThunk(
  "product/addBulkProducts",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequestWithFile(
        `product/add-bulk-products`,
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
 
export const productSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    restAdminData: (state) => {
      
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsList.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action?.payload;
      })
      .addCase(fetchProductsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action?.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});
 
export const { restAdminData } = productSlice.actions;
 
export default productSlice.reducer;