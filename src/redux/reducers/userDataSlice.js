import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";
import { socket, user_type } from "../../constants";
import { postRequestWithToken } from "../../api/Requests";

const initialState = {
  user: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  showSuccessSignup: false,
  error: null,
};

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(`/auth/${id}`);
      return response?.user || response?.data; // Return the actual user data or fallback
    } catch (error) {
      // Log and pass the error
      console.log("API error:", error);
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequest(`auth/login`, values);
      if (response.code !== 200) {
        toast(response?.message, { type: "error" });
        return rejectWithValue(response?.message || "Unknown error");
      }
      const { result } = await response;
      for (let x in result) {
        sessionStorage.setItem(`${x}`, result[x]);
        // console.log(`RESPONSE OF LOGIN USER : ${x} ${result[x]}`);
      }

      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          // If permission is already granted, register the user directly
          const userId =
            response.result.buyer_id ||
            response.result.admin_id ||
            response.result.supplier_id;
          socket.emit(
            user_type == "Buyer"
              ? "registerBuyer"
              : user_type == "Admin"
              ? "registerAdmin"
              : user_type == "Supplier" && "register",
            userId
          );
        } else if (Notification.permission !== "denied") {
          // Request permission if not already denied
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            const userId =
              response.result.buyer_id ||
              response.result.admin_id ||
              response.result.supplier_id;
            socket.emit(
              user_type == "Buyer"
                ? "registerBuyer"
                : user_type == "Admin"
                ? "registerAdmin"
                : user_type == "Supplier" && "register",
              userId
            );
          }
        }
      }
      // return response?.data?.user;
      return result;
      // return rejectWithValue(response?.data?.err);
    } catch (error) {
      //   toast.error("An error occurred while logging in");
      return rejectWithValue(error?.response?.data || "Unknown error");
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (user, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequestWithFile(
        `auth/register`,
        user
      );

      if (response?.code !== 200) {
        toast(response.message, { type: "error" });
        console.log("error in supplier/register api");
        return rejectWithValue(
          response.message || "Error occured with registration"
        );
      }

      (user_type == "Supplier" || user_type == "Buyer") &&
        socket.emit(
          user_type == "Supplier"
            ? "supplierRegistration"
            : "buyerRegistration",
          {
            adminId: process.env.REACT_APP_ADMIN_ID,
            message: `New ${user_type} Registration Request `,
            link: process.env.REACT_APP_PUBLIC_URL,
            // send other details if needed
          }
        );
    } catch (error) {
      return rejectWithValue(
        error.response ? error?.response?.data : error.message
      );
    }
  }
);

export const userDataSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserData: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action?.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.showSuccessSignup = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.showSuccessSignup = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.showSuccessSignup = false;
      });
  },
});

export const { resetUserData } = userDataSlice.actions;

export default userDataSlice.reducer;
