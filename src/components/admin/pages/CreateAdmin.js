import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { createData } from "../slices/adminSlice";

const CreateAdmin = () => {
  const initialadminData = {
    adminId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    createDate: "",
    firstName: "",
    lastName: "",
    middlename: "",
    username: "",
    email: "",
    address: "",
    aadhaarCard: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    bankaccountnumber: "",
    ifscCode: "",
    role: "admin",
  };

  const [adminData, setAdminData] = useState(initialadminData);
  const dispatch = useDispatch();
  const { dataList, status, error } = useSelector((state) => state.admin);
  const adminList = dataList?.filter((user) => user.role === "admin");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      (name === "aadhaarCard" ||
        name === "phoneNumber" ||
        name === "bankaccountnumber") &&
      !/^\d*$/.test(value)
    ) {
      return;
    }

    setAdminData({ ...adminData, [name]: value });
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "firstName",
      "lastName",
      "username",
      "dateOfBirth",
      "phoneNumber",
      "email",
      "aadhaarCard",
      "bankaccountnumber",
      "ifscCode",
      "password",
      "confirmPassword",
    ];

    for (let field of requiredFields) {
      if (!adminData[field]) {
        Swal.fire({
          title: "Incomplete Form",
          text: 'Please Fill The All Input Flied.',
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
    }

    if (adminData.password !== adminData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match.",
      });
      return;
    }

    // min 25 years
    const dob = new Date(adminData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (
      age < 25 ||
      (age === 25 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
    ) {
      Swal.fire({
        title: "Invalid Date of Birth",
        text: "Admin must be at least 25 years old.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (adminData.aadhaarCard.length !== 12) {
      Swal.fire({
        title: "Invalid Aadhaar Card Number",
        text: "Aadhaar card number must be exactly 12 digits.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (adminData.phoneNumber.length !== 10) {
      Swal.fire({
        title: "Invalid Phone Number",
        text: "Phone number must be exactly 10 digits.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (adminData.bankaccountnumber.length !== 12) {
      Swal.fire({
        title: "Invalid Bank Account Number",
        text: "Bank account number must be exactly 12 digits.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (adminData.ifscCode.length > 10) {
      Swal.fire({
        title: "Invalid IFSC Code",
        text: "IFSC code must be at most 10 characters.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const currentDate = new Date().toISOString();
    const dataWithDate = { ...adminData, createDate: currentDate };

    if (adminList.some((user) => user.aadhaarCard === adminData.aadhaarCard)) {
      Swal.fire({
        title: "Aadhaar Card Exists",
        text: "Aadhaar card number already exists. Please use a different one.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const { confirmPassword, ...dataToSubmit } = dataWithDate;

    try {
      if (adminData.password !== adminData.confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Passwords do not match.",
        });
        return;
      }

      dispatch(createData(dataToSubmit)).unwrap().then(() => {
        Swal.fire({
          title: "Admin Created!",
          text: `Admin ID: ${dataWithDate.adminId}`,
          icon: "success",
          confirmButtonText: "OK",
        });
        setAdminData(initialadminData);
      }).catch(() => {
        Swal.fire({
          title: "Error",
          text: error || "Something went wrong!",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred. Please try again.",
      });
      console.error("Registration error:", error);
    }
    
  };

  return (
    <div className="h-screen flex items-center justify-center p-6">
      <Paper
        elevation={10}
        className="p-8 w-[900px] bg-white rounded-2xl shadow-lg"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Create Admin
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex gap-4">
              <TextField
                label="First Name"
                name="firstName"
                value={adminData.firstName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
              />

              <TextField
                label="Middle Name"
                name="middlename"
                value={adminData.middlename}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
              />

              <TextField
                label="Last Name"
                name="lastName"
                value={adminData.lastName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
              />
            </div>

            <div className="flex gap-[15px]">
              <TextField
                label="Username"
                name="username"
                value={adminData.username}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
                autoComplete="username"
              />
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={adminData.dateOfBirth}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ shrink: true, className: "text-gray-600" }}
              />
            </div>

            <div className="flex gap-4">
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={adminData.phoneNumber}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                inputProps={{ maxLength: 10, minLength: 10 }}
                InputLabelProps={{ className: "text-gray-600" }}
              />

              <TextField
                label="Email"
                name="email"
                value={adminData.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
              />
            </div>

            <div className="flex gap-[15px]">
              <TextField
                label="Aadhaar Card Number"
                name="aadhaarCard"
                value={adminData.aadhaarCard}
                onChange={handleChange}
                type="text"
                fullWidth
                variant="outlined"
                inputProps={{ maxLength: 12, minLength: 12 }}
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
              />

              <TextField
                label="Bank Account Number"
                name="bankaccountnumber"
                type="text"
                value={adminData.bankaccountnumber}
                onChange={handleChange}
                fullWidth
                inputProps={{ maxLength: 12, minLength: 12 }}
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
              />

              <TextField
                label="IFSC Code"
                name="ifscCode"
                value={adminData.ifscCode}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                inputProps={{ maxLength: 10, minLength: 10 }}
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
              />
            </div>

            <div className="flex items-center gap-[15px]">
              <FormControl
                component="fieldset"
                fullWidth
                className="bg-gray-50 rounded-md"
              >
                <FormLabel component="legend" className="text-gray-600">
                  Gender
                </FormLabel>
                <RadioGroup
                  name="gender"
                  value={adminData.gender}
                  onChange={handleRadioChange}
                  row
                >
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                label="address"
                name="address"
                value={adminData.address}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md mt-[8px] top-[5px]"
                InputLabelProps={{ className: "text-gray-600" }}
              />
            </div>

            <TextField
              label="Password"
              name="password"
              type="password"
              value={adminData.password}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              className="bg-gray-50 rounded-md"
              InputLabelProps={{ className: "text-gray-600" }}
              autoComplete="new-password"
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
              fullWidth
              value={adminData.confirmPassword}
              onChange={handleChange}
              autoComplete="off"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="mt-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Create Admin
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default CreateAdmin;
