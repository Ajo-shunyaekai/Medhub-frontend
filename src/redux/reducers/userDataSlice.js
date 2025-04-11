import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";
import { socket, usertype } from "../../constants";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  showSuccessSignup: false,
  error: null,
  loading: false,
  emailToResetPassword: "",
};

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.getRequest(`/auth/${id}`);
      return response?.user || response?.data; // Return the actual user data or fallback
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequest(`auth/login`, values);
      if (response?.code !== 200) {
        toast(response?.message, { type: "error" });
        return rejectWithValue(response?.message || "Unknown error");
      }
      const { data } = await response;
      for (let x in data) {
        localStorage.setItem(`${x}`, data[x]);
        if (x == "registeredAddress") {
          for (let y in data[x]) {
            localStorage.setItem(`${y}`, data[x][y]);
          }
        }
      }

      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          // If permission is already granted, register the user directly
          const userId =
            response.data.buyer_id ||
            response.data.admin_id ||
            response.data.supplier_id;
          socket.emit(
            usertype == "Buyer"
              ? "registerBuyer"
              : usertype == "Admin"
              ? "registerAdmin"
              : usertype == "Supplier" && "register",
            userId
          );
        } else if (Notification.permission !== "denied") {
          // Request permission if not already denied
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            const userId =
              response.data.buyer_id ||
              response.data.admin_id ||
              response.data.supplier_id;
            socket.emit(
              usertype == "Buyer"
                ? "registerBuyer"
                : usertype == "Admin"
                ? "registerAdmin"
                : usertype == "Supplier" && "register",
              userId
            );
          }
        }
      }
      // return response?.data?.user;
      return data;
      // return rejectWithValue(response?.data?.err);
    } catch (error) {
      //   toast.error("An error occurred while logging in");
      return rejectWithValue(error?.response?.data || "Unknown error");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequest(`auth/logout`);
      if (response?.code !== 200) {
        toast(response?.message, { type: "error" });
        return rejectWithValue(response?.message || "Unknown error");
      }

      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      localStorage?.clear();

      return {};

      // return rejectWithValue(response?.data?.err);
    } catch (error) {
      //   toast.error("An error occurred while logging in");
      return rejectWithValue(error?.response?.data || "Unknown error");
    }
  }
);

export const editProfile = createAsyncThunk(
  "user/editProfile",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests?.postRequest(
        `auth/edit-profile/${values?.id}`,
        { ...values?.obj, type: "Registered" }
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
        return rejectWithValue(
          response.message || "Error occured with registration"
        );
      }

      (usertype == "Supplier" || usertype == "Buyer") &&
        socket.emit(
          usertype == "Supplier" ? "supplierRegistration" : "buyerRegistration",
          {
            adminId: process.env.REACT_APP_ADMIN_ID,
            message: `New ${usertype} Registration Request `,
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
    setEmailToResetPassword: (state, action) => {
      state.emailToResetPassword = action.payload;
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
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(editProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(editProfile.rejected, (state, action) => {
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

export const { resetUserData, setEmailToResetPassword } = userDataSlice.actions;

export default userDataSlice.reducer;
