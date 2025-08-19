import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";
import { toast } from "react-toastify";

const initialState = {
  bids: [],
  bidCount: 0,
  loading: false,
  error: null,
  bidDetails: {},
  updatedbid: {},
  bidToUpdate: {},
  currentBidDetails: {},
  addToFavourite: {},
};

export const fetchBidList = createAsyncThunk(
  "bid/fetchBidList",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests.postRequest("bid/get-bid-list", {
        buyer_id: values,
      });
      return response?.bids;
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchBidById = createAsyncThunk(
  "bid/fetchBidById",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiRequests.postRequest(
        // `bid/${values?.bidId}`
        url
      );
      return response?.data;
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchCurrentBidDetails = createAsyncThunk(
  "bid/currentBidDetails",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiRequests.postRequest(
        // `bid/${values?.bidId}`
        url
      );
      return response?.data;
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const addToFavourite = createAsyncThunk(
  "bid/addToFavourite",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiRequests.postRequest(
        url
      );
      return response?.data;
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchbidDataRedux = createAsyncThunk(
  "medicine/fetchbidDataRedux",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiRequests.getRequest(url);
      return response.result;
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const addBid = createAsyncThunk(
  "bid/addBid",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequestWithFile(
        `bid/add`,
        values
      );
      if (response?.code !== 200) {
        toast(response?.message, { type: "error" });
        return rejectWithValue(response?.message || "Unknown error");
      }
      const { data, message } = await response;
      toast.success(message);

      return data;
      // return rejectWithValue(response?.data?.err);
    } catch (error) {
      //   toast.error("An error occurred while logging in");
      return rejectWithValue(error?.response?.data || "Unknown error");
    }
  }
);

export const editbid = createAsyncThunk(
  "bid/editbid",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequest(
        `bid/edit-bid/${values?.obj?.id}`,
        { ...values?.obj }
      );
      if (response?.code !== 200) {
        toast(response?.message, { type: "error" });
        return rejectWithValue(response?.message || "Unknown error");
      }
      const { data, message } = await response;
      toast.success(message);

      return data;
      // return rejectWithValue(response?.data?.err);
    } catch (error) {
      //   toast.error("An error occurred while logging in");
      return rejectWithValue(error?.response?.data || "Unknown error");
    }
  }
);

export const updateBidProductDetails = createAsyncThunk(
  `bid/updateBidProductDetails`,
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequest(
        `bid/add-participant/${values.bidId}/${values.itemId}`,
        values
      );
      if (response?.code !== 200) {
        toast(response?.message, { type: "error" });
        return rejectWithValue(response?.message || "Unknown error");
      }
      const { data, message } = await response;
      toast.success(message);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Unknown error");
    }
  }
);

export const deletebid = createAsyncThunk(
  "bid/deletebid",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequest(
        `bid/delete-bid/${values?.id}`,
        { ...values?.obj }
      );
      if (response?.code !== 200) {
        toast(response?.message, { type: "error" });
        return rejectWithValue(response?.message || "Unknown error");
      }
      const { data, message } = await response;
      toast.success(message);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Unknown error");
    }
  }
);

export const requestQuote = createAsyncThunk(
  "bid/requestQuote",
  async (values, { rejectWithValue }) => {
    try {
      console.log('values',values)
      const response = await apiRequests?.postRequest(
        `bid/send-enquiry/${values.bidId}/${values.additionalDetailsId}/${values.supplierId}`,
        values
      );
      if (response?.code !== 200) {
        toast(response?.message, { type: "error" });
        return rejectWithValue(response?.message || "Unknown error");
      }
      const { data, message } = await response;
      toast.success(message);

      return data;
      // return rejectWithValue(response?.data?.err);
    } catch (error) {
      //   toast.error("An error occurred while logging in");
      return rejectWithValue(error?.response?.data || "Unknown error");
    }
  }
);

export const bidSlice = createSlice({
  name: "bid",
  initialState,
  reducers: {
    restbidData: (state) => {
      state.bids = [];
      state.loading = undefined;
      state.error = null;
    },
    updatebid: (state, action) => {
      state.updatedbid = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBidList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBidList.fulfilled, (state, action) => {
        state.loading = false;
        state.bids = action?.payload;
        state.bidCount = action?.payload?.totalItems;
      })
      .addCase(fetchBidList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBidById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBidById.fulfilled, (state, action) => {
        state.loading = false;
        state.bidDetails = action?.payload;
      })
      .addCase(fetchBidById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentBidDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentBidDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBidDetails = action?.payload;
      })
      .addCase(fetchCurrentBidDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToFavourite.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToFavourite.fulfilled, (state, action) => {
        state.loading = false;
        state.addToFavourite = action?.payload;
      })
      .addCase(addToFavourite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(requestQuote.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestQuote.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(requestQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletebid.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletebid.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deletebid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBidProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBidProductDetails.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateBidProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchbidDataRedux.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchbidDataRedux.fulfilled, (state, action) => {
        state.loading = false;
        state.bidData = action?.payload;
      })
      .addCase(fetchbidDataRedux.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { restbidData, updatebid } = bidSlice.actions;

export default bidSlice.reducer;
