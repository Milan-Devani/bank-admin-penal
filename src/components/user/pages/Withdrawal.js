import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateBalance, addTransaction } from '../Slice/accountSlice';
import axios from 'axios';
import { Button, Typography, Paper, Alert, TextField } from '@mui/material';
import Swal from 'sweetalert2';

function Withdrawal() {
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [error, setError] = useState('');
  const { accountData, isVerified } = useSelector((state) => state.account);
  const dispatch = useDispatch();
  console.log(accountData);
  

  if (!accountData) {
    return (
      <div className="p-6 md:p-8 bg-gradient-to-r min-h-screen flex items-center justify-center">
        <Paper elevation={6} className="p-8 space-y-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
          <Typography variant="h4" component="h1" className="text-center text-purple-900 font-bold">
            Loading account data...
          </Typography>
        </Paper>
      </div>
    );
  }

  const id = accountData.id;
  const name = accountData.firstName + ' ' + accountData.lastName;
  const currentBalance = accountData.initialDeposit;
  const accountNumber = accountData.accountNumber || '';  
const accountLastDigit = accountNumber ? accountNumber.slice(-4) : '';


  const handleWithdrawalapi = async () => {
    const amount = parseFloat(withdrawalAmount);
    if (amount > 0 && amount <= currentBalance) {
      const updatedBalance = currentBalance - amount;

      try {
        // Update balance
        await axios.patch(`http://localhost:5000/bankaccount/${id}`, {
          initialDeposit: updatedBalance
        });

        // Create transaction
        const transaction = {
          id: Date.now(),
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          type: 'Withdrawal',
          amount: `₹${amount}`,
          accountNumber,
          accountLastDigit,
        };
        await axios.post('http://localhost:5000/transactions', transaction);

        // Update balance
        dispatch(updateBalance({ id, amount: updatedBalance }));
        dispatch(addTransaction(transaction));

        setWithdrawalAmount('');
        setError('');
        Swal.fire({
          title: "WITHDRAWAL",
          text: `Withdrawal of ₹${amount} was successful!`,
          icon: "success"
        });
      } catch (error) {
        setError('There was an error processing your withdrawal. Please try again.');
        console.error('API error:', error);
      }
    } else {
      setError('Invalid amount or insufficient balance');
    }
  };

  const handleWithdrawalbtn = () => {
    Swal.fire({
      title: "PIN REQUIRED",
      text: "Please enter your PIN to perform the withdrawal.",
      input: "password",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Please enter your PIN.";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (accountData.pin === result.value) {
          handleWithdrawalapi();
        } else {
          Swal.fire({
            title: "Incorrect PIN",
            text: "The entered PIN is incorrect.",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div className="p-6 md:p-8 bg-gradient-to-r min-h-screen flex items-center justify-center">
      <div className="shadow-2xl rounded-[20px] p-8 space-y-6 bg-white shadow-lg max-w-lg mx-auto">
        <Typography variant="h4" component="h1" className="text-center text-purple-900 font-bold">
          Account Holder: {name}
        </Typography>
        {isVerified ? (
          <Alert severity="success" className="mb-4">Account is verified!</Alert>
        ) : (
          <Alert severity="warning" className="mb-4">Account not verified</Alert>
        )}
        
        <TextField
          fullWidth
          label="Enter amount to withdraw"
          type="number"
          variant="outlined"
          margin="normal"
          value={withdrawalAmount}
          onChange={(e) => {
            setWithdrawalAmount(e.target.value);
            setError('');
          }}
          InputProps={{ style: { color: 'purple' } }}
          autoComplete="off"
        />

        {error && <p style={styles.error}>{error}</p>}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleWithdrawalbtn}
          style={{ backgroundColor: '#6D28D9' }} 
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
}

const styles = {
  error: { color: 'red' },
};

export default Withdrawal;
