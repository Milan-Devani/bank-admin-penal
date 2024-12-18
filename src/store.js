import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './components/user/Slice/accountSlice';
import adminReducer from './components/admin/slices/adminSlice';
import bankFundReducer from './components/admin/slices/bankFundSlice';
import bankAccountReducer from './components/employ/slices/Employerslices';
import usersReducer from './components/employ/slices/Employerslices';
import loginReducer from './components/LoginSlices/loginReducer.js';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    admin: adminReducer,
    bankFund: bankFundReducer,
    bankAccount: bankAccountReducer,
    users: usersReducer,
    user: loginReducer,
  },
});