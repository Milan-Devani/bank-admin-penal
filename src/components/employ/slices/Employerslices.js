import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBankAccount = createAsyncThunk("users/fetchBankAccount", async () => {
  const response = await axios.get("http://localhost:5000/bankaccount");
  return response.data;
});

export const createBankAccount = createAsyncThunk(
  "users/createBankAccount",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/bankaccount", formData);
      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        return rejectWithValue("Failed to create account.");
      }
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const updateBankAccount = createAsyncThunk(
  "users/updateBankAccount", 
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/bankaccount/${id}`, formData);
      if (response.status === 200) {
        return { id, formData };
      } else {
        return rejectWithValue("Failed to update account.");
      }
    } catch (error) {
      return rejectWithValue("Error updating account.");
    }
  }
);


export const DeleteBankAccount = createAsyncThunk("users/DeleteBankAccount", async (id) => {
  await axios.delete(`http://localhost:5000/bankaccount/${id}`);
  return id;
});

export const bulkDeleteBankAccounts = createAsyncThunk(
  "users/bulkDeleteBankAccounts",
  async (selectedUsers) => {
    await Promise.all(
      selectedUsers.map((id) => axios.delete(`http://localhost:5000/bankaccount/${id}`))
    );
    return selectedUsers;
  }
);

const initialState = {
  users: [],
  status: "idle",
  error: null,
};

const Employerslices = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get users
      .addCase(fetchBankAccount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBankAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchBankAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Create user
      .addCase(createBankAccount.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      // Update user
      .addCase(updateBankAccount.fulfilled, (state, action) => {
        const { id, formData } = action.payload;
        const existingUser = state.users.find((user) => user.id === id);
        if (existingUser) {
          Object.assign(existingUser, formData);
        }
      })
      // Delete user
      .addCase(DeleteBankAccount.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      // Bulk delete users
      .addCase(bulkDeleteBankAccounts.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (user) => !action.payload.includes(user.id)
        );
      });
  },
});

export default Employerslices.reducer;
