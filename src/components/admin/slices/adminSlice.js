import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// get employees data
export const getdata = createAsyncThunk(
  "admin/getdata",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/auth");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//  create new employee
export const createData = createAsyncThunk(
  "admin/createData",
  async (employeData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/auth", employeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//delete employee
export const deleteData = createAsyncThunk(
  "admin/deleteData",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:5000/auth/${id}`);
      return id; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update employee
export const updateData = createAsyncThunk(
  "admin/updateData",
  async ({ id, employeData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/auth/${id}`, employeData);
      return { id, employeData: response.data };  // Return id and updated data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    dataList: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get employees
      .addCase(getdata.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getdata.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dataList = action.payload;
      })
      .addCase(getdata.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Create data
      .addCase(createData.fulfilled, (state, action) => {
        state.dataList.push(action.payload);
      })
      // Delete data
      .addCase(deleteData.fulfilled, (state, action) => {
        state.dataList = state.dataList.filter(
          (employe) => employe.id !== action.payload
        );
      })
      // Update employee
      .addCase(updateData.fulfilled, (state, action) => {
        const index = state.dataList.findIndex(
          (employe) => employe.id === action.payload.id
        );
        if (index !== -1) {
          state.dataList[index] = action.payload.employeData;
        }
      });
  }

});

export default adminSlice.reducer;