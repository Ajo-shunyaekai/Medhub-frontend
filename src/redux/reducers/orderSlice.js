import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const initialState = {
  orders: [],
  orderCount: 0,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  orderData: {},
};

// Socket Connection
const socket = io.connect(process.env.REACT_APP_SERVER_URL, {
  autoConnect: false,
});

export const fetchOrderListRedux = createAsyncThunk(
  "order/fetchOrderListRedux",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiRequests.getRequest(url);
      return response.result.data;
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchOrderDataRedux = createAsyncThunk(
  "medicine/fetchOrderDataRedux",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests.getRequest(
        `order/get-specific-order-details/${values?.order_id}`,
        values
      );
      return response.result;
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "address/fetchOrderById",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests.getRequest(
        `order/get-specific-order-details/${values?.id}`
      );
      return response?.result;
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const bookLogistics = createAsyncThunk(
  "order/bookLogistics",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequest(`order/book-logistics`, {
        ...values?.obj,
      });
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

export const submitPickupDetails = createAsyncThunk(
  "order/submitPickupDetails",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequest(
        `order/submit-pickup-details`,
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

export const remindSupplier = createAsyncThunk(
  "order/remindSupplier",
  async ({ id, supplier_id }, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequest(
        `order/remind-supplier/${id}`
      );
      if (response?.code != 200) {
        toast(response?.message, { type: "error" });
        return rejectWithValue(response?.message || "Unknown error");
      }
      const { data, message } = await response;
      toast.success(message);

      socket.emit("remindSupplierToProceedOrder", {
        supplierId: supplier_id,
        message: `Please Proceed with the order ${id}`,
        link: process.env.REACT_APP_PUBLIC_URL,
      });

      return data;
      // return rejectWithValue(response?.data?.err);
    } catch (error) {
      //   toast.error("An error occurred while logging in");
      return rejectWithValue(error?.response?.data || "Unknown error");
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    restOrderData: (state) => {
      state.orders = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderListRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrderListRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action?.payload?.data;
        state.orderCount = action?.payload?.totalItems;
      })
      .addCase(fetchOrderListRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchOrderDataRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrderDataRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orderData = action?.payload;
      })
      .addCase(fetchOrderDataRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orderData = action?.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { restOrderData } = orderSlice.actions;

export default orderSlice.reducer;
