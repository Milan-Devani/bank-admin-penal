import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBankFunds, submitTransaction, updateBankFund, selectFund, toggleEditMode, fetchTransactions } from '../slices/bankFundSlice';
import Adminchart from './AdminTransactionschart'; 

function BankFund() {
  const dispatch = useDispatch();
  const { funds, selectedFund, isEditMode } = useSelector((state) => state.bankFund);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [actionType, setActionType] = useState('');
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchTransactionId, setSearchTransactionId] = useState('');
  const [filterDeposit, setFilterDeposit] = useState(true);
  const [filterWithdrawal, setFilterWithdrawal] = useState(true);
  const [openAnalyticsDialog, setOpenAnalyticsDialog] = useState(false) 
  const transactions = useSelector(state => state.bankFund.transactions);
  const status = useSelector(state => state.bankFund.status);

  useEffect(() => {
    dispatch(fetchBankFunds());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const adminTransactions = transactions.filter((transaction) => transaction.role === 'admin');

  const verifyPin = (fund, onSuccess) => {
    Swal.fire({
      title: "PIN REQUIRED",
      text: "Please enter your PIN to proceed.",
      input: "password",
      inputAttributes: {
        maxlength: 6,
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Please enter your PIN.";
        }
        if (value.length !== 6) {
          return "PIN must be 6 digits.";
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const enteredPin = parseInt(result.value, 10);
        if (fund.pin === enteredPin) {
          onSuccess();
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

  const handleTransaction = (fund, action) => {
    dispatch(selectFund(fund));
    setActionType(action);
    setOpenTransactionDialog(true);
  };

  const submitTransactionAmount = () => {
    if (!transactionAmount || !selectedFund) return;

    setOpenTransactionDialog(false);
    verifyPin(selectedFund, () => {
      const newAmount = actionType === 'deposit'
        ? selectedFund.bankfundAmount + Number(transactionAmount)
        : selectedFund.bankfundAmount - Number(transactionAmount);

      if (newAmount < 0) {
        Swal.fire({
          title: "Insufficient Funds",
          text: "You cannot withdraw more than the available balance.",
          icon: "error",
        });
        return;
      }

      dispatch(submitTransaction({ selectedFund, actionType, transactionAmount }))
        .then(() => {
          Swal.fire({
            title: `${actionType === 'deposit' ? 'Deposit' : 'Withdrawal'} was successful!`,
            icon: "success"
          });
          setTransactionAmount('');
        })
        .catch((err) => console.error(err));
    });
  };

  const handleShowDetails = (fund) => {
    dispatch(selectFund(fund));
    dispatch(toggleEditMode(false));
    setOpenDetailsDialog(true);
  };

  const handleUpdateDetails = () => {
    if (!selectedFund) return;

    dispatch(updateBankFund(selectedFund))
      .then(() => {
        Swal.fire({
          title: "Details updated successfully.",
          icon: "success"
        });
        setOpenDetailsDialog(false);
      })
      .catch((err) => console.error(err));
  };

  const handleShowCurrentAmount = (fund) => {
    verifyPin(fund, () => {
      Swal.fire({
        title: `Current Fund is ₹${fund.bankfundAmount}`,
        icon: 'success',
      });
    });
  };

  const sortTransactions = (transactions) => {
    return [...transactions].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB - dateA;
    });
  };

  const sortedAdminTransactions = sortTransactions(adminTransactions);

  const filteredTransactions = sortedAdminTransactions.filter((transaction) =>
    transaction.id.toString().includes(searchTransactionId) &&
    ((transaction.type.toLowerCase() === 'deposit' && filterDeposit) ||
      (transaction.type.toLowerCase() === 'withdraw' && filterWithdrawal))
  );

  return (
    <div>
      <div className="h-[250px] flex gap-[20px]">
        <Card style={{ borderRadius: '12px' }} className="w-full max-w-2xl shadow-lg">
          <CardContent>
            <h4 className="text-[32px] text-center text-purple-700 mb-6 font-bold">
              Bank Fund Details
            </h4>

            {funds.map((fund, ind) => (
              <div key={ind} className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <Typography variant="h6" className="font-semibold">Account Number:</Typography>
                  <Typography>{`XXXX-XXXX-${fund.accountNumber.slice(-4)}`}</Typography>
                </div>
                <div>
                  <Typography variant="h6" className="font-semibold">PAN Card Number:</Typography>
                  <Typography>{`XXX-XXX-${fund.pancardNumber.slice(-4)}`}</Typography>
                </div>
                <div className="col-span-2 flex justify-between mt-4 gap-[10px]">
                  <Button variant="outlined" color="primary" onClick={() => handleTransaction(fund, 'deposit')} className="mr-4">
                    Deposit
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleTransaction(fund, 'withdraw')}>
                    Withdraw
                  </Button>
                  <Button variant="outlined" color="success" onClick={() => handleShowCurrentAmount(fund)}>
                    Show Current Fund
                  </Button>
                  <Button variant="outlined" color="info" onClick={() => handleShowDetails(fund)}>
                    Show Details
                  </Button>
                </div>
              </div>
            ))}

            {selectedFund && (
              <Dialog open={openTransactionDialog} onClose={() => setOpenTransactionDialog(false)}>
                <DialogTitle>{`${actionType === 'deposit' ? 'Deposit' : 'Withdraw'} Funds`}</DialogTitle>
                <DialogContent>
                  <Typography variant="h6" className="font-semibold mb-4">
                    {`Account: XXXXXXXX${selectedFund.accountNumber.slice(-4)}`}
                  </Typography>
                  <TextField
                    label="Enter Amount"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    className="mb-4"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenTransactionDialog(false)} color="secondary">
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" onClick={submitTransactionAmount} className="bg-purple-700 text-white">
                    Submit Amount
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            {selectedFund && (
              <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>Update Fund Details</DialogTitle>
                <DialogContent>
                  <div className='flex gap-[20px] my-[15px]'>
                    <TextField
                      label="Account Number"
                      variant="outlined"
                      fullWidth
                      value={selectedFund.accountNumber}
                      onChange={(e) => dispatch(selectFund({ ...selectedFund, accountNumber: e.target.value }))}
                      className="mb-4"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      label="PAN Card Number"
                      variant="outlined"
                      fullWidth
                      value={selectedFund.pancardNumber}
                      onChange={(e) => dispatch(selectFund({ ...selectedFund, pancardNumber: e.target.value }))}
                      className="mb-4"
                      InputProps={{
                        readOnly: !isEditMode,
                      }}
                    />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDetailsDialog(false)} color="secondary">
                    Cancel
                  </Button>
                  <Button onClick={() => dispatch(toggleEditMode(true))} color="primary">
                    Edit
                  </Button>
                  {isEditMode && (
                    <Button onClick={handleUpdateDetails} variant="contained" color="primary" className="bg-purple-700 text-white">
                      Save
                    </Button>
                  )}
                </DialogActions>
              </Dialog>
            )}
          </CardContent>
        </Card>

        <div className="w-[75%] max-w-2xl">
          <TextField
            label="Search by Transaction Id"
            variant="outlined"
            fullWidth
            value={searchTransactionId}
            onChange={(e) => setSearchTransactionId(e.target.value)}
            className="mb-6"
          />

          <div className="flex mt-[30px] gap-[15px] mb-6">
            <label>
              <input
                type="checkbox"
                checked={filterDeposit}
                onChange={() => setFilterDeposit(!filterDeposit)}
              />
              Deposit
            </label>
            <label>
              <input
                type="checkbox"
                checked={filterWithdrawal}
                onChange={() => setFilterWithdrawal(!filterWithdrawal)}
              />
              Withdrawal
            </label>
          </div>

          <div>
            <Button variant="outlined" color="success" onClick={() => setOpenAnalyticsDialog(true)}>
              Show BankFund Transactions Analytics
            </Button>

            <Dialog style={{maxWidth:'fit-content' , maxHeight:'100%' , display:"block" , margin: "0 auto"}} open={openAnalyticsDialog} onClose={() => setOpenAnalyticsDialog(false)} fullWidth maxWidth="lg">
              <DialogTitle>BankFund Transactions Analytics</DialogTitle>
              <DialogContent>
                <Adminchart />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenAnalyticsDialog(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>

        </div>
      </div>
      <div>
        <Card style={{ borderRadius: '12px' }} className="w-full mt-[20px] max-w-full shadow-lg">
          <CardContent>
            <h4 className="text-[32px] text-center text-purple-700 mb-[0] font-bold">
              Transactions
            </h4>
            {status === 'loading' ? (
              <Typography>Loading transactions...</Typography>
            ) : filteredTransactions.length === 0 ? (
              <Typography>No transactions found.</Typography>
            ) : (
              <div className="relative top-[10px] max-h-[350px] overflow-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="sticky top-0 bg-white shadow">
                    <tr>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600">
                        Transaction Id
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600">
                        Date
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600">
                        Time
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600">
                        Transaction Type
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 border-b border-gray-300">{transaction.id}</td>
                        <td className="px-6 py-4 border-b border-gray-300">{transaction.date}</td>
                        <td className="px-6 py-4 border-b border-gray-300">{transaction.time}</td>
                        <td
                          className={`px-6 py-4 border-b border-gray-300 ${transaction.type.toLowerCase() === 'withdraw'
                            ? 'text-red-500'
                            : transaction.type.toLowerCase() === 'deposit'
                              ? 'text-green-500'
                              : 'text-gray-500'
                            }`}
                        >
                          {transaction.type}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-300">₹{transaction.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default BankFund;
