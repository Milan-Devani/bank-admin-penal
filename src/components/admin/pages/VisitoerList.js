import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getdata,
  deleteData,
  updateData,
} from "../slices/adminSlice";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const VisitoerList = () => {
  const [editMode, setEditMode] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("iduser");

  const dispatch = useDispatch();
  const { dataList, status, error } = useSelector((state) => state.admin);

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  useEffect(() => {
    dispatch(getdata());
  }, [dispatch]);

  const filteredUsersList = Array.isArray(dataList) ? dataList.filter((user) => user.role === "user").filter((user) => {
    const iduser = selectedFilter === "iduser"
      ? user.employeId?.toString().includes(searchInput)
      : false;
    const idMatch = selectedFilter === "idMatch"
      ? user.id?.toString().includes(searchInput)
      : false;
    const nameMatch = selectedFilter === "nameMatch"
      ? `${user.firstName || ""} ${user.lastName || ""}`
        .toLowerCase()
        .includes(searchInput.toLowerCase())
      : false;
    const usernameMatch = selectedFilter === "usernameMatch"
      ? `${user.username || ""}`
        .toLowerCase()
        .includes(searchInput.toLowerCase())
      : false;
    const phoneMatch = selectedFilter === "phoneMatch"
      ? (user.phoneNumber || "").includes(searchInput)
      : false;
    const emailMatch = selectedFilter === "emailMatch"
      ? (user.email || "").toLowerCase().includes(searchInput.toLowerCase())
      : false;

    return iduser || idMatch || nameMatch || usernameMatch || phoneMatch || emailMatch;
  })
    : [];

  const handleEditEmploye = (user) => {
    setEditMode(true);
    setCurrentEdit(user);
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
      );
      setEditMode(false);
      setCurrentEdit(null);
    } else {
      console.error("user ID is undefined during update");
    }
  };

  const handledeleteData = (id) => {
    if (!id) {
      console.error("user ID is undefined or null");
      return;
    }
    dispatch(deleteData(id))
      .unwrap()
      .catch((error) => {
        console.error("Failed to delete user:", error);
      });
  };

  const handleClose = () => {
    setEditMode(false);
    setCurrentEdit(null);
    setIsEditable(false);
  };

  return (
    <Box mt={5}>
      {status === "loading" && <CircularProgress />}
      {status === "failed" && <Typography color="error">{error}</Typography>}

      {status === "succeeded" && (
        <>
          <div className="flex">
            <div className="mr-[30px]">
            <Typography variant="h4" component="h1" gutterBottom>
            Visiter List
            </Typography>
            </div>
            <div className="flex gap-[20px]">
            <Box mb={3}>
              <TextField
                className="w-[444px]"
                label="Search by ID, Name, Phone, or Email"
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
                  <MenuItem value="iduser">Employe ID</MenuItem>
                  <MenuItem value="idMatch">ID</MenuItem>
                  <MenuItem value="nameMatch">Name</MenuItem>
                  <MenuItem value="usernameMatch">Username</MenuItem>
                  <MenuItem value="phoneMatch">Phone</MenuItem>
                  <MenuItem value="emailMatch">Email</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
          </div>

          

          <Typography variant="h6" component="h2" gutterBottom>
            Total Visitor: {filteredUsersList.length}
          </Typography>

          <div className="">
            {/* Slider Component */}

            <TableContainer component={Paper} style={{ height: '480px' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center"><strong>No.</strong></TableCell>
                    <TableCell align="center"><strong>Employee ID</strong></TableCell>
                    <TableCell align="center"><strong>Name</strong></TableCell>
                    <TableCell align="center"><strong>Username</strong></TableCell>
                    <TableCell align="center"><strong>Email</strong></TableCell>
                    <TableCell align="center"><strong>Date of Birth</strong></TableCell>
                    <TableCell align="center"><strong>Phone Number</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsersList.length > 0 ? (
                    filteredUsersList.map((employe, ind) => (
                      <TableRow key={`${employe.id}-${ind}`}>
                        <TableCell align="center">{ind + 1}</TableCell>
                        <TableCell align="center">{employe.employeId}</TableCell>
                        <TableCell align="center">{employe.firstName} {employe.lastName}</TableCell>
                        <TableCell align="center">{employe.username}</TableCell>
                        <TableCell align="center">{employe.email}</TableCell>
                        <TableCell align="center">{employe.dateOfBirth}</TableCell>
                        <TableCell align="center">{employe.phoneNumber}</TableCell>
                        <TableCell align="center">
                          <Button color="primary" onClick={() => handleEditEmploye(employe)}>
                            <VisibilityIcon />
                          </Button>
                          <Button color="secondary" onClick={() => handledeleteData(employe.id)}>
                            <DeleteForeverIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No visitor found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {currentEdit && (
            <Dialog open={editMode} onClose={handleClose}>
              <div className="flex justify-between px-[20px]">
                <DialogTitle>
                  {isEditable ? "Employee Details" : "View Employee Details"}
                </DialogTitle>
                <IconButton
                  onClick={handleMakeEditable}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
              </div>
              <DialogContent>
                <div className="space-y-4 px-[30px]">
                  <div className="flex gap-4">
                    <TextField
                      label="First Name"
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

export default VisitoerList;