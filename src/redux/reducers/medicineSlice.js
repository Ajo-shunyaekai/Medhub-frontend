import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import { apiRequests } from "../../api";

const initialState = {
  medicines: [],
  medicinesCount : 0,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  medicineData: {}
};

export const fetchMedicineListRedux = createAsyncThunk(
  "medicine/fetchMedicineListRedux",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiRequests.getRequest(url)
      return response.result.data; 
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchMedicineyDataRedux = createAsyncThunk(
  "medicine/fetchMedicineyDataRedux",
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiRequests.getRequest(`medicine/get-specific-medicine-details/${values?.product_id}`, values)
      return response.result 
    } catch (error) {
      // Log and pass the error
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const medicineSlice = createSlice({
  name: "medicine",
  initialState,
  reducers: {
    restMedicineData: (state) => {
      state.medicines = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicineListRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMedicineListRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.medicines = action?.payload?.data;
        state.medicinesCount = action?.payload?.totalItems;
      })
      .addCase(fetchMedicineListRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMedicineyDataRedux.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMedicineyDataRedux.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.medicineData = action?.payload;
      })
      .addCase(fetchMedicineyDataRedux.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

export const { restMedicineData } = medicineSlice.actions;

export default medicineSlice.reducer;