import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// get bankfunds
export const fetchBankFunds = createAsyncThunk('bankFund/fetchBankFunds', async () => {
  const response = await axios.get('http://localhost:5000/bankfund');
  return response.data;
});

// update bankfund
export const updateBankFund = createAsyncThunk('bankFund/updateBankFund', async (fund) => {
  const response = await axios.put(`http://localhost:5000/bankfund/${fund.id}`, fund);
  return response.data;
});

export const submitTransaction = createAsyncThunk('bankFund/submitTransaction', async ({ selectedFund, actionType, transactionAmount }) => {
  const newAmount = actionType === 'deposit'
      ? selectedFund.bankfundAmount + Number(transactionAmount)
      : selectedFund.bankfundAmount - Number(transactionAmount);

  if (newAmount < 0) {
    throw new Error('Insufficient funds for withdrawal.');
  }

  // Update bankfund amount
  const response = await axios.put(`http://localhost:5000/bankfund/${selectedFund.id}`, {
    ...selectedFund,
    bankfundAmount: newAmount,
  });

  const transactionResponse = await axios.post('http://localhost:5000/transactions', {
    role: 'admin',
    id: Math.floor(100000 + Math.random() * 900000),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString(),
    type: actionType,
    amount: Number(transactionAmount),
    accountNumber: selectedFund.accountNumber,
    accountLastDigit: selectedFund.accountNumber.slice(-4),
  });

  return { fund: response.data, transaction: transactionResponse.data };
});

// get transactions
export const fetchTransactions = createAsyncThunk('bankFund/fetchTransactions', async () => {
  const response = await axios.get('http://localhost:5000/transactions');
  return response.data;
});

const bankFundSlice = createSlice({
  name: 'bankFund',
  initialState: {
    funds: [],
    transactions: [],
    selectedFund: null,
    isEditMode: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    selectFund: (state, action) => {
      state.selectedFund = action.payload;
    },
    toggleEditMode: (state, action) => {
      state.isEditMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // get bankfund 
      .addCase(fetchBankFunds.fulfilled, (state, action) => {
        state.funds = action.payload;
      })
      //transaction submission
      .addCase(submitTransaction.fulfilled, (state, action) => {
        const { fund, transaction } = action.payload;
        const index = state.funds.findIndex((f) => f.id === fund.id);
        if (index !== -1) {
          state.funds[index] = fund;
        }
        state.transactions.unshift(transaction);
      })
      // update bankfund
      .addCase(updateBankFund.fulfilled, (state, action) => {
        const index = state.funds.findIndex((fund) => fund.id === action.payload.id);
        if (index !== -1) {
          state.funds[index] = action.payload;
        }
      })
      // get transaction
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
      });
  }
});

export const { selectFund, toggleEditMode } = bankFundSlice.actions;

export default bankFundSlice.reducer;
