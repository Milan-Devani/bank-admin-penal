import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ReceiptIcon from '@mui/icons-material/Receipt';
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";
import { fetchBankAccount, updateBankAccount, DeleteBankAccount, bulkDeleteBankAccounts } from "../slices/Employerslices"; // Import the slice actions
import { fetchTransactions } from "../../user/Slice/accountSlice";

const BankAccountlist = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const status = useSelector((state) => state.users.status);
  const { transactions } = useSelector((state) => state.account);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPopup, setSearchPopup] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");
  const [dateFilter, setDateFilter] = useState('all');
  const [filterWithdrawal, setFilterWithdrawal] = useState(true);
  const [filterDeposit, setFilterDeposit] = useState(true);
  const [filtertransfer, setFilterTransfer] = useState(true);
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");


  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middlename: "",
    gender: "",
    dob: "",
    idType: "",
    accountType: "",
    pannumber: "",
    idNumber: "",
    email: "",
    address: "",
    number: "",
    accountNumber: "",
    initialDeposit: "",
    age: "",
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBankAccount());
    }
  }, [status, dispatch]);

  const handleOpenTransaction = (userId) => {
    const selectedUser = users.find((user) => user.id === userId); 
    if (selectedUser) {
      console.log("Account Number:", selectedUser.accountNumber);
      setSelectedUser(selectedUser);
      dispatch(fetchTransactions(selectedUser.accountNumber));
      setTransactionDialogOpen(true); 
    }
  };


  const handleCloseTransactionDialog = () => {
    setTransactionDialogOpen(false);
  };

  // console.log("transactions", transactions);

  const filteredTransactions = transactions.filter((transaction) => {
    if (transaction.accountNumber !== selectedUser?.accountNumber) return false;

    if (searchPopup && !transaction.id.toString().includes(searchPopup)) return false;

    if (filterDeposit && filterWithdrawal) return true; 
    if (filterDeposit && ['Deposit', 'Deposit (B2B)'].includes(transaction.type)) return true;
    if (filterWithdrawal && transaction.type === 'Withdrawal') return true;
    if (filtertransfer && transaction.type === 'Transfer (B2B)') return true;



    return false;
  });


  const handleOpen = (user, mode = "view") => {
    setFormData({
      ...user,
      accountType: user.accountType || "",
    });
    setSelectedUser(user);
    setEditMode(mode === "edit");
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setEditMode(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUser) {
      dispatch(updateBankAccount({ id: selectedUser.id, formData }));
      handleClose();
      Swal.fire({
        title: "Account Details updated successfully!",
        icon: "success",
      });
    }
  };


  const handleDelete = (id) => {
    dispatch(DeleteBankAccount(id));
  };

  const handleBulkDelete = () => {
    dispatch(bulkDeleteBankAccounts(selectedUsers));
    setSelectedUsers([]);
  };

  const handleCheckboxChange = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const sortedUsers = [...users]
    .filter((user) => {
      if (
        [
          "SavingsAccount",
          "CurrentAccount",
          "SalaryAccount",
          "FixedDepositAccount",
        ].includes(sortCriteria)
      ) {
        return user.accountType === sortCriteria;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortCriteria) {
        case "highestAmount":
          return b.initialDeposit - a.initialDeposit;
        case "lowestAmount":
          return a.initialDeposit - b.initialDeposit;
        case "A-Z":
          return a.firstName.localeCompare(b.firstName);
        default:
          return 0;
      }
    });

  const handleRadioChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchPopup(e.target.value);
  };


  const filteredUsers = sortedUsers.filter((user) => {
    if (!searchTerm) return true;
    const lowerSearchTerm = searchTerm.toLowerCase();
    const fieldsToSearch = [
      user.firstName,
      user.middlename,
      user.lastName,
      user.accountNumber,
      user.pannumber,
      user.number,
      user.email,
    ];
    return fieldsToSearch.some(
      (field) =>
        field && field.toString().toLowerCase().includes(lowerSearchTerm)
    );
  });


  return (
    <div className="w-full max-w-[1240px] p-4">
      <div className="flex gap-[30px]">
        <TextField
          label="Search"
          className="shadow-2xl rounded-[10px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <Select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Sort by
            </MenuItem>
            <MenuItem value="highestAmount">Highest Amount</MenuItem>
            <MenuItem value="lowestAmount">Lowest Amount</MenuItem>
            <MenuItem value="A-Z">A-Z</MenuItem>
            <MenuItem value="SavingsAccount">Savings account</MenuItem>
            <MenuItem value="CurrentAccount">Current account</MenuItem>
            <MenuItem value="SalaryAccount">Salary account</MenuItem>
            <MenuItem value="FixedDepositAccount">
              Fixed Deposit (FD) account
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* User Table */}
      <div className="rounded-lg shadow-2xl">
        <TableContainer component={Paper} style={{ maxHeight: '550px', height: '100%' }} className="bg-[#f5f5f5]">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ padding: '0', paddingLeft: '5px' }}>
                  <Checkbox
                    indeterminate={
                      selectedUsers.length > 0 &&
                      selectedUsers.length < users.length
                    }
                    checked={selectedUsers.length === users.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(users.map((user) => user.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />

                </TableCell>
                <TableCell>No.</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell style={{ padding: '16px 0', paddingLeft: '5px' }}>Phone Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Account Type</TableCell>
                <TableCell>Account Number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.number}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.accountType}</TableCell>
                  <TableCell>
                    XXXXXXXX
                    {user.accountNumber
                      ? user.accountNumber.slice(-4)
                      : "N/A"}
                  </TableCell>
                  <TableCell className="flex items-center">
                    <div className="flex">
                      <IconButton onClick={() => handleOpenTransaction(user.id)}>
                        <ReceiptIcon className="text-black" />
                      </IconButton>
                      <IconButton style={{ color: 'purple' }} onClick={() => handleOpen(user, "view")}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton style={{ color: 'red' }} onClick={() => handleDelete(user.id)}>
                        <DeleteForeverIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog
        open={transactionDialogOpen}
        onClose={handleCloseTransactionDialog}
        fullWidth
        maxWidth="lg"
        className=""
      >
        <div className="flex">
          <DialogTitle>User Transactions</DialogTitle>
          <div className="mt-4 flex space-x-4">
            <input
              type="text"
              placeholder="Search by ID"
              value={searchPopup}
              onChange={handleSearchChange}
              className="border p-2"
            />

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 px-4 py-2"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateFilter === "custom" && (
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={customDateFrom}
                  onChange={(e) => setCustomDateFrom(e.target.value)}
                  className="border border-gray-300 px-4 py-2"
                />
                <input
                  type="date"
                  value={customDateTo}
                  onChange={(e) => setCustomDateTo(e.target.value)}
                  className="border border-gray-300 px-4 py-2"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <label>
                <input
                  type="checkbox"
                  checked={filterDeposit}
                  onChange={() => setFilterDeposit(!filterDeposit)}
                  className="mr-1"
                />
                Deposit
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filterWithdrawal}
                  onChange={() => setFilterWithdrawal(!filterWithdrawal)}
                  className="mr-1"
                />
                Withdrawal
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filtertransfer}
                  onChange={() => setFilterTransfer(!filtertransfer)}
                  className="mr-1"
                />
                Transfer(B2B)
              </label>
            </div>
          </div>
        </div>


        <DialogContent className="!overflow-hidden">
          <div className="relative top-[-1px] max-h-[540px] overflow-auto">
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
                    Account Number
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 border-b border-gray-300">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-300">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-300">
                        {transaction.time}
                      </td>
                      <td
                        className={`px-6 py-4 border-b border-gray-300 ${transaction.type === "Withdrawal"
                          ? "text-red-500"
                          : transaction.type === "Deposit"
                            ? "text-green-500"
                            : transaction.type === "Deposit (B2B)"
                              ? "text-green-500"
                              : "text-blue-500"
                          }`}
                      >
                        {transaction.type}
                      </td>

                      <td className="px-6 py-4 border-b border-gray-300">
                        XXXXXXXX
                        {transaction.accountNumber
                          ? transaction.accountNumber.slice(-4)
                          : "N/A"}
                      </td>

                      <td className="px-6 py-4 border-b border-gray-300">
                        {transaction.amount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No transactions available for this user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTransactionDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {selectedUsers.length > 0 && (
        <Button
          onClick={handleBulkDelete}
          variant="contained"
          color="error"
          style={{ marginTop: "10px" }}
        >
          Delete Selected Users
        </Button>
      )}

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { maxWidth: '800px' } }}>
        <DialogTitle>{editMode ? "Edit User" : "View User"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            InputProps={{
              readOnly: !editMode,
            }}
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            className="bg-gray-50 rounded-md"
            InputProps={{
              readOnly: !editMode,
            }}
          />
          <TextField
            label="Middle Name"
            name="middlename"
            value={formData.middlename}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: !editMode,
            }}
          />
          <FormControl component="fieldset" fullWidth>
            <FormLabel>Gender</FormLabel>
            <RadioGroup
              name="gender"
              value={formData.gender}
              onChange={handleRadioChange}
              row
            >
              <FormControlLabel
                value="Male"
                control={<Radio />}
                label="Male"
                disabled={!editMode}
              />
              <FormControlLabel
                value="Female"
                control={<Radio />}
                label="Female"
                disabled={!editMode}
              />
            </RadioGroup>
          </FormControl>
          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: !editMode,
            }}
          />
          <FormControl component="fieldset" fullWidth>
            <FormLabel>ID Type</FormLabel>
            <RadioGroup
              name="idType"
              value={formData.idType}
              onChange={handleRadioChange}
              row
            >
              <FormControlLabel
                value="aadhaar"
                control={<Radio />}
                label="Aadhaar Card"
                disabled={!editMode}
              />
              <FormControlLabel
                value="voter"
                control={<Radio />}
                label="Voter ID"
                disabled={!editMode}
              />
            </RadioGroup>
          </FormControl>

          <TextField
            label={formData.idType === "aadhaar" ? "Aadhaar Card Number" : "Voter ID Number"}
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            className="bg-gray-50 rounded-md"
            inputProps={{
              maxLength: formData.idType === "aadhaar" ? 12 : 10,
              minLength: formData.idType === "aadhaar" ? 12 : 10,
              readOnly: !editMode
            }}
            error={formData.idNumber.length !== (formData.idType === "aadhaar" ? 12 : 10)}
            helperText={
              formData.idNumber.length !== (formData.idType === "aadhaar" ? 12 : 10)
                ? `Please enter a valid ${formData.idType === "aadhaar" ? "12" : "10"}-digit ID`
                : ""
            }
          />


          <FormControl component="fieldset" fullWidth>
            <FormLabel>Account Type</FormLabel>
            <RadioGroup
              name="accountType"
              value={formData.accountType} 
              onChange={handleRadioChange}
              row
            >
              <FormControlLabel
                value="SavingsAccount"
                control={<Radio />}
                label="Savings Account"
                disabled={!editMode}
              />
              <FormControlLabel
                value="CurrentAccount"
                control={<Radio />}
                label="Current Account"
                disabled={!editMode}
              />
              <FormControlLabel
                value="SalaryAccount"
                control={<Radio />}
                label="Salary Account"
                disabled={!editMode}
              />
              <FormControlLabel
                value="FixedDepositAccount"
                control={<Radio />}
                label="Fixed Deposit (FD) Account"
                disabled={!editMode}
              />
            </RadioGroup>
          </FormControl>

          <TextField
            label="Account Number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            label="pan card Number"
            name="pannumber"
            value={formData.pannumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            label="Phone Number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: !editMode,
            }}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: !editMode,
            }}
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: !editMode,
            }}
          />
          <TextField
            label="Employee username"
            name="create Employee username"
            value={formData.Employeeusername}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            label="Employee id"
            name="create Employee id"
            value={formData.Employeeid}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Current Amount"
            name="Amount"
            value={formData.initialDeposit}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <div className="flex flex-row-reverse">
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            {editMode && (
              <Button onClick={handleSubmit} color="primary">
                Save
              </Button>
            )}
          </DialogActions>
          {!editMode && (
            <div className="flex justify-start p-2">
              <Button onClick={() => handleOpen(selectedUser, "edit")} color="primary">
                Edit
              </Button>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default BankAccountlist;
