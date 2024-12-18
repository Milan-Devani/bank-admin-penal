import React, { useEffect, useState } from "react";
import axios from "axios";
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
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";

const Userlist = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middlename: "",
    gender: "",
    dob: "",
    idType: "",
    accountType: "",
    idNumber: "",
    email: "",
    address: "",
    number: "",
    accountNumber: "",
    initialDeposit: "",
    age: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/bankaccount");
        setUsers(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpen = (user, mode = "view") => {
    setFormData(user);
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

  const handleRadioChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/bankaccount/${selectedUser.id}`,
        formData
      );

      if (response.status === 200) {
        const updatedUsers = users.map((user) =>
          user.id === selectedUser.id ? formData : user
        );
        setUsers(updatedUsers);
        handleClose();

        Swal.fire({
          title: "Account Details updated successfully!",
          icon: "success",
        });
      } else {
        alert("Failed to update account.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the account.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/bankaccount/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedUsers.map((id) =>
          axios.delete(`http://localhost:5000/bankaccount/${id}`)
        )
      );
      setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    } catch (error) {
      console.log("Selected Users:", selectedUsers);
      console.error("Error deleting users:", error);
    }
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
          "FixedDeposit(FD)Account",
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

  const filteredUsers = sortedUsers.filter((user) => {
    if (!searchTerm) return true;
    const lowerSearchTerm = searchTerm.toLowerCase();
    const fieldsToSearch = [
      user.firstName,
      user.middlename,
      user.lastName,
      user.accountNumber,
      user.number,
      user.email,
    ];
    return fieldsToSearch.some(
      (field) =>
        field && field.toString().toLowerCase().includes(lowerSearchTerm)
    );
  });

  return (
    <div className="px-[30px]">
      <div className="flex gap-[30px]">
        <TextField
          label="Search"
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
            <MenuItem value="FixedDeposit(FD)Account">
              Fixed deposit account
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
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
              <TableCell>Index</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Account Type</TableCell>
              <TableCell>Account Number</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Current Balance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              filteredUsers.map((account, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(account.id)}
                      onChange={() => handleCheckboxChange(account.id)}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {account.firstName} {account.middlename} {account.lastName}
                  </TableCell>
                  <TableCell>{account.accountType}</TableCell>
                  <TableCell>
                    XXXXXXXX
                    {account.accountNumber
                      ? account.accountNumber.slice(-4)
                      : "N/A"}
                  </TableCell>

                  <TableCell>{account.number}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.address}</TableCell>
                  <TableCell>{account.initialDeposit}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpen(account, "view")}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(account.id)}
                      color="error"
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedUsers.length > 0 && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleBulkDelete}
          className="mt-4"
        >
          Delete Selected ({selectedUsers.length})
        </Button>
      )}

      <Dialog open={open} onClose={handleClose}>
        <div className="flex justify-between px-[20px]">
          <DialogTitle>
            {editMode ? "Update Account" : "View Account"}
          </DialogTitle>
          <IconButton
            onClick={() => setEditMode(true)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
        </div>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mt-[20px]">
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputProps={{ readOnly: !editMode }}
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputProps={{ readOnly: !editMode }}
              />
              <TextField
                label="Middle Name"
                name="middlename"
                value={formData.middlename}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputProps={{ readOnly: !editMode }}
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
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                className="bg-gray-50 rounded-md"
                InputProps={{ readOnly: !editMode }}
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
                label={
                  formData.idType === "aadhaar"
                    ? "Aadhaar Card Number"
                    : "Voter ID Number"
                }
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputProps={{ readOnly: !editMode }}
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputProps={{ readOnly: !editMode }}
              />

              <TextField
                label="opening date "
                name="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputProps={{ readOnly: !editMode }}
              />

              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputProps={{ readOnly: !editMode }}
              />
              <TextField
                label="Phone Number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputProps={{ readOnly: !editMode }}
              />
              <TextField
                label="Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                fullWidth
                variant="outlined"
                InputProps={{ readOnly: !editMode }}
                className="bg-gray-50 rounded-md"
              />
              <TextField
                label="Age"
                value={formData.age}
                fullWidth
                variant="outlined"
                InputProps={{ readOnly: !editMode }}
                className="bg-gray-50 rounded-md"
              />
            </div>
            {editMode && (
              <div className="flex justify-between mt-4">
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary" variant="contained">
                  Update
                </Button>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Userlist;
