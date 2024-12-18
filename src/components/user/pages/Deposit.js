import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateBalance, addTransaction, createTransactions } from '../Slice/accountSlice';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button, TextField, Typography, Paper, Alert } from '@mui/material';

function Deposit() {
  const [error, setError] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const { accountData, isVerified } = useSelector((state) => state.account);
  const dispatch = useDispatch();

  if (!accountData) {
    return <Typography variant="h6">Loading account information...</Typography>;
  }

  const id = accountData.id;
  const name = `${accountData.firstName} ${accountData.lastName}`;
  const currentBalance = parseFloat(accountData.initialDeposit); 
  const accountNumber = accountData.accountNumber;
  const accountLastDigit = accountData.accountNumber.slice(-4);

  const handleDepositApi = async () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      const updatedBalance = currentBalance + amount; 
  
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
          type: 'Deposit',
          amount: `₹${amount}`,
          accountNumber,
          accountLastDigit,
        };
  
        // Dispatch transaction
        dispatch(createTransactions(transaction));
  
        // Update balance
        dispatch(updateBalance({ id, amount: updatedBalance }));
  
        setDepositAmount('');
        setError('');
        Swal.fire({
          title: "DEPOSIT",
          text: `Deposit of ₹${amount} was successful!`,
          icon: "success"
        });
      } catch (error) {
        setError('There was an error processing your deposit. Please try again.');
        console.error('API error:', error);
      }
    } else {
      setError('Please enter a valid deposit amount');
    }
  };
  
  const handleDeposit = () => {
    Swal.fire({
      title: "PIN REQUIRED",
      text: "Please enter your PIN to perform the deposit.",
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
          handleDepositApi();
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
      <div className="p-8 shadow-2xl space-y-6 bg-white rounded-[20px] shadow-lg max-w-lg mx-auto">
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
          label="Enter amount to deposit"
          type="number"
          variant="outlined"
          margin="normal"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          InputProps={{ style: { color: 'purple' } }}
          autoComplete="off"
        />

        {error && <p style={styles.error}>{error}</p>}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleDeposit}
          style={{ backgroundColor: '#6D28D9' }}
        >
          Deposit
        </Button>
      </div>
    </div>
  );
}

const styles = {
  error: { color: 'red' },
};

export default Deposit;