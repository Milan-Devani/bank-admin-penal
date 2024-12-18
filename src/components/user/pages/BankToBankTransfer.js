import React, { useEffect, useState } from 'react';
import { fetchBankAccount } from '../../employ/slices/Employerslices';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { createTransactions, updateBalance } from '../Slice/accountSlice';
import Swal from 'sweetalert2';
import { Button, TextField, Card, CardContent, Alert } from '@mui/material';
import { motion } from 'framer-motion';

function BankToBankTransfer() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const { accountData } = useSelector((state) => state.account);
  const [accountNumber, setAccountNumber] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [holderaccount, setHolderaccount] = useState(accountData);
  const [errorMessage, setErrorMessage] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const initialTransaction = {
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    type: 'transfer',
    amount: `₹${transferAmount}`,
  };
  const [transaction, setTransaction] = useState(initialTransaction);
  const useraccountamount = holderaccount.initialDeposit;

  useEffect(() => {
    dispatch(fetchBankAccount());
  }, [dispatch]);

  const handleCheckAccountNumber = () => {
    const foundUser = users.find((user) => user.accountNumber === accountNumber);

    if (foundUser) {
      setFoundUser(foundUser);
      setErrorMessage('');
      setSuccessMessage('');
    } else {
      setFoundUser(null);
      setErrorMessage('Account number not found.');
    }
  };

  const resetForm = () => {
    setTransaction(initialTransaction);
  };

  const handleTransferAmountapi = async () => {
    if (foundUser && parseFloat(transferAmount) > 0) {
      const currentBalance = parseFloat(foundUser.initialDeposit);
      const useraccountamount = parseFloat(holderaccount.initialDeposit);
      const transferValue = parseFloat(transferAmount);
      const updatedDeposit = currentBalance + transferValue;
      const updateuserTransfer = useraccountamount - transferValue;

      if (useraccountamount < transferValue) {
        setErrorMessage('Insufficient funds for this transfer.');
        return;
      }

      try {
        const response = await axios.patch(`http://localhost:5000/bankaccount/${foundUser.id}`, {
          initialDeposit: updatedDeposit,
        });

        const useraccountresponse = await axios.patch(`http://localhost:5000/bankaccount/${accountData.id}`, {
          initialDeposit: updateuserTransfer,
        });

        if (response.status === 200 && useraccountresponse.status === 200) {
          setSuccessMessage('Transfer successful.');
          setErrorMessage('');
          setTransferAmount('');
          setFoundUser((prevUser) => ({ ...prevUser, initialDeposit: updatedDeposit }));
          setHolderaccount((holderprevUser) => ({ ...holderprevUser, initialDeposit: updateuserTransfer }));

          const senderTransaction = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            type: 'Transfer (B2B)',
            amount: `₹${transferValue}`,
            accountNumber: accountData.accountNumber,
            receiveraccountNumber: foundUser.accountNumber,
            senderaccountNumber: accountData.accountNumber,
          };

          const receiverTransaction = {
            id: Date.now() + 1,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            type: 'Deposit (B2B)',
            amount: `₹${transferValue}`,
            accountNumber: foundUser.accountNumber,
            senderaccountNumber: accountData.accountNumber,
            receiveraccountNumber: foundUser.accountNumber,
          };

          Swal.fire({
            title: "Transfer",
            text: `Transfer of ₹${transferValue} was successful!`,
            icon: "success"
          });

          dispatch(createTransactions(senderTransaction));
          dispatch(createTransactions(receiverTransaction));
          dispatch(updateBalance({ amount: updateuserTransfer }));

          resetForm();
        } else {
          setErrorMessage('Failed to transfer balance.');
        }
      } catch (error) {
        setErrorMessage('An error occurred while updating the balance: ' + error.message);
      }
    } else {
      setErrorMessage('Please enter a valid amount.');
    }
  };

  const handleTransfer = () => {
    Swal.fire({
      title: "PIN REQUIRED",
      text: "Please enter your PIN.",
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
          handleTransferAmountapi();
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
    <motion.div
      className="flex justify-center items-center pt-[100px] "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Card
        component={motion.div}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full p-4 shadow-lg rounded-lg bg-white"
      >
        <CardContent>
          <motion.h5
            className="mb-[20px] text-[30px] text-center text-gray-800"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Bank to Bank Transfer
          </motion.h5>

          <TextField
            label="Enter Account Number"
            variant="outlined"
            fullWidth
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(e.target.value);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className="mb-4"
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCheckAccountNumber}
            sx={{ mt: 1 }}
          >
            Check Account Number
          </Button>

          {foundUser ? (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="my-[10px] text-[18px]">
                <strong>Account Holder Name:</strong> {foundUser.firstName} {foundUser.lastName}
              </p>

              <TextField
                label="Enter Transfer Amount"
                variant="outlined"
                fullWidth
                value={transferAmount}
                onChange={(e) => {
                  setTransferAmount(e.target.value);
                  setErrorMessage('');
                }}
              />

              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleTransfer}
                sx={{ mt: 1 }}
              >
                Transfer
              </Button>
            </motion.div>
          ) : (
            errorMessage && (
              <Alert severity="error" className="mb-4">
                {errorMessage}
              </Alert>
            )
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Alert severity="success" className="mb-4">
                {successMessage}
              </Alert>
            </motion.div>
          )}
          {errorMessage && !foundUser && (
            <Alert severity="error" className="mb-4">
              {errorMessage}
            </Alert>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default BankToBankTransfer;
