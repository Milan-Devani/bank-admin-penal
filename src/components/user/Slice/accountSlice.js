import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  accountData: [],
  isVerified: false,
  transactions: [],
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  "account/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/transactions");
      const sortedTransactions = response.data.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB - dateA;
      });
      return sortedTransactions;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTransactions = createAsyncThunk(
  "account/createTransactions",
  async (transaction, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/transactions", transaction);
      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        return rejectWithValue("Failed to transaction.");
      }
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const verifyAccount = createAsyncThunk(
  "account/verifyAccount",
  async (accountNumber, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/bankaccount/${accountNumber}`);
      console.log(response.data);

      if (response.data) {
        return response.data;
      } else {
        return rejectWithValue("Account not found.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return rejectWithValue("Account not found. Please check the account number.");
      }
      return rejectWithValue("An error occurred. Please try again later.");
    }
  }
);


const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccountInfo: (state, action) => {
      state.accountData = action.payload;
      state.isVerified = true;
    },
    clearAccountInfo: (state) => {
      state.accountData = null;
      state.isVerified = false;
      state.transactions = [];
    },
    updateBalance: (state, action) => {
      const { amount } = action.payload;
      if (state.accountData) {
        state.accountData.initialDeposit = amount;
      }
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
    updatePin: (state, action) => {
      const { pin } = action.payload;
      if (state.accountData) {
        state.accountData.pin = pin;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.loading = false;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createTransactions.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
  },
});

export const {
  setAccountInfo,
  clearAccountInfo,
  updateBalance,
  addTransaction,
  updatePin,
} = accountSlice.actions;

export default accountSlice.reducer;