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
  CircularProgress,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Radio,
  FormLabel,
  RadioGroup,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { deleteData, getdata, updateData } from "../slices/adminSlice";

const AdminList = () => {
  const [editMode, setEditMode] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("idadmin");

  const dispatch = useDispatch();
  const { dataList, status, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getdata());
  }, [dispatch]);

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const filteredadminsList = Array.isArray(dataList)
    ? dataList
        .filter((admin) => admin.role === "admin")
        .filter((admin) => {
          const idadmin =
            selectedFilter === "idadmin"
              ? admin.adminId?.toString().includes(searchInput)
              : false;
          const Adharnumber =
            selectedFilter === "adharMatch"
              ? admin.aadhaarCard?.toString().includes(searchInput)
              : false;
          const nameMatch =
            selectedFilter === "nameMatch"
              ? `${admin.firstName || ""} ${admin.lastName || ""}`
                  .toLowerCase()
                  .includes(searchInput.toLowerCase())
              : false;
          const usernameMatch =
            selectedFilter === "usernameMatch"
              ? `${admin.username || ""}`
                  .toLowerCase()
                  .includes(searchInput.toLowerCase())
              : false;
          const phoneMatch =
            selectedFilter === "phoneMatch"
              ? (admin.phoneNumber || "").includes(searchInput)
              : false;
          const emailMatch =
            selectedFilter === "emailMatch"
              ? (admin.email || "")
                  .toLowerCase()
                  .includes(searchInput.toLowerCase())
              : false;

          return (
            idadmin ||
            Adharnumber ||
            nameMatch ||
            usernameMatch ||
            phoneMatch ||
            emailMatch
          );
        })
    : [];

  const handleEditadmin = (admin) => {
    setEditMode(true);
    setCurrentEdit(admin);
    setIsEditable(false);
  };

  const handleMakeEditable = () => {
    setIsEditable(true);
  };

  const handleupdateData = () => {
    if (currentEdit && currentEdit.id) {
      dispatch(
        updateData({
          id: currentEdit.id,
          employeData: currentEdit,
        })
      )
        .unwrap()
        .then(() => {
          setEditMode(false);
          setCurrentEdit(null);
        })
        .catch((error) => {
          console.error("Failed to update admin:", error);
        });
    } else {
      console.error("Admin ID is undefined during update");
    }
  };

  const handledeleteData = (id) => {
    if (!id) {
      console.error("Admin ID is undefined or null");
      return;
    }
    dispatch(deleteData(id))
      .unwrap()
      .catch((error) => {
        console.error("Failed to delete Admin:", error);
      });
  };

  const handleClose = () => {
    setEditMode(false);
    setCurrentEdit(null);
    setIsEditable(false);
  };

  return (
    <Box mt={5}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admins List
      </Typography>

      {status === "loading" && <CircularProgress />}
      {status === "failed" && <Typography color="error">{error}</Typography>}

      {status === "succeeded" && (
        <>
          <div className="flex gap-[20px]">
            <Box mb={3}>
              <TextField
                className="w-[444px]"
                label="Search by Selected Filter"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                fullWidth
              />
            </Box>

            <Box mb={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by</InputLabel>
                <Select
                  value={selectedFilter}
                  onChange={handleFilterChange}
                  label="Filter by"
                >
                  <MenuItem value="idadmin">Admin ID</MenuItem>
                  <MenuItem value="adharMatch">aadhaar Number</MenuItem>
                  <MenuItem value="nameMatch">Name</MenuItem>
                  <MenuItem value="usernameMatch">Username</MenuItem>
                  <MenuItem value="phoneMatch">Phone</MenuItem>
                  <MenuItem value="emailMatch">Email</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>

          <Typography variant="h6" component="h2" gutterBottom>
            Total Admins: {filteredadminsList.length}
          </Typography>

          <TableContainer component={Paper} style={{ height: "480px" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <strong>No.</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Admin ID</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Username</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Phone Number</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>AadhaarCard Number</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Date of Birth</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredadminsList.length > 0 ? (
                  filteredadminsList.map((admin, ind) => (
                    <TableRow key={admin.id}>
                      <TableCell align="center">{ind + 1}</TableCell>
                      <TableCell align="center">{admin.adminId}</TableCell>
                      <TableCell align="center">
                        {admin.firstName} {admin.lastName}
                      </TableCell>
                      <TableCell align="center">{admin.username}</TableCell>
                      <TableCell align="center">{admin.email}</TableCell>
                      <TableCell align="center">{admin.phoneNumber}</TableCell>
                      <TableCell align="center">
                        {admin.aadhaarCard
                          ? `XXXX-XXXX-${admin.aadhaarCard.slice(-4)}`
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">{admin.dateOfBirth}</TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          onClick={() => handleEditadmin(admin)}
                        >
                          <VisibilityIcon />
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => handledeleteData(admin.id)}
                        >
                          <DeleteForeverIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No Admins found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {currentEdit && (
            <Dialog
              open={editMode}
              onClose={handleClose}
              fullWidth
              maxWidth="md"
              PaperProps={{
                sx: { maxWidth: "800px", width: "100%" },
              }}
            >
              <div className="flex justify-between px-[20px]">
                <DialogTitle>
                  {isEditable ? "Admin Details" : "View Admin Details"}
                </DialogTitle>
                <IconButton onClick={handleMakeEditable} color="primary">
                  <EditIcon />
                </IconButton>
              </div>
              <DialogContent>
                <div className="space-y-4 px-[30px]">
                  <div className="flex gap-4">
                    <TextField
                      label="First Name"
                      className="mb-[20px]"
                      value={currentEdit.firstName}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          firstName: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: !isEditable }}
                    />
                    <TextField
                      label="Last Name"
                      value={currentEdit.lastName}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          lastName: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: !isEditable }}
                    />
                    <TextField
                      label="Middle Name"
                      value={currentEdit.middlename}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          middlename: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: !isEditable }}
                    />
                  </div>
                  <div className="flex gap-[20px]">
                    <TextField
                      label="Username"
                      value={currentEdit.username}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          username: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: !isEditable }}
                    />
                    <TextField
                      label="Password"
                      type="password"
                      value={currentEdit.password}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          password: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: !isEditable }}
                    />
                  </div>

                  <div className="flex gap-[10px]">
                    <TextField
                      label="Create Admin Date & Time"
                      value={currentEdit.createDate}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          address: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: !isEditable }}
                    />
                    <TextField
                      label="DOB"
                      value={currentEdit.dateOfBirth}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          address: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: !isEditable }}
                    />

                    <FormControl className="top-[12px]" component="fieldset" fullWidth>
                      <FormLabel>Gender</FormLabel>
                      <RadioGroup
                        name="gender"
                        value={currentEdit.gender}
                        onChange={(e) =>
                          setCurrentEdit({
                            ...currentEdit,
                            address: e.target.value,
                          })
                        }
                        row
                      >
                        <FormControlLabel
                          value="Male"
                          control={<Radio />}
                          label="Male"
                          disabled={true}
                        />
                        <FormControlLabel
                          value="Female"
                          control={<Radio />}
                          label="Female"
                          disabled={true}
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>

                  <div className="flex gap-4">
                    <TextField
                      label="Address"
                      value={currentEdit.address}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          address: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: true }}
                    />

                    <TextField
                      label="Phone Number"
                      value={currentEdit.phoneNumber}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          phoneNumber: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: !isEditable }}
                    />

                    <TextField
                      label="Email"
                      value={currentEdit.email}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          email: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: !isEditable }}
                    />
                  </div>

                  <div className="flex gap-4">
                    <TextField
                      label="AadhaarCard Number"
                      value={currentEdit.aadhaarCard}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          aadhaarCard: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: !isEditable }}
                    />

                    <TextField
                      label="Bank Account Number"
                      value={currentEdit.bankaccountnumber}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          bankaccountnumber: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: !isEditable }}
                    />

                    <TextField
                      label="IFSC Code"
                      value={currentEdit.ifscCode}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          ifscCode: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: !isEditable }}
                    />
                  </div>
                </div>
              </DialogContent>
              <DialogActions>
                {isEditable && (
                  <Button
                    onClick={handleupdateData}
                    color="primary"
                    disabled={!isEditable}
                  >
                    Update
                  </Button>
                )}
                <Button onClick={handleClose} color="secondary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </>
      )}
    </Box>
  );
};

export default AdminList;
