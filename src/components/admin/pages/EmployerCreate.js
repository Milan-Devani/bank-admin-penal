import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Radio,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  FormControl,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createData } from "../slices/adminSlice";
import Swal from "sweetalert2";

const EmployerCreate = () => {
  const initialEmployeData = {
    createDate: "",
    firstName: "",
    lastName: "",
    middlename: "",
    username: "",
    email: "",
    address: "",
    gender: "",
    aadhaarCard: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    employeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    role: "employer",
  };

  const requiredFields = [
    "firstName",
    "lastName",
    "middlename",
    "username",
    "email",
    "address",
    "gender",
    "aadhaarCard",
    "dateOfBirth",
    "password",
    "confirmPassword",
    "phoneNumber",
  ];

  const [employeData, setEmployeData] = useState(initialEmployeData);
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.admin);

  const handleChange = (e) => {
    setEmployeData({ ...employeData, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setEmployeData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    for (const field of requiredFields) {
      if (!employeData[field]) {
        Swal.fire({
          icon: "error",
          title: "Missing Input",
          text: `Please fill in all required fields.`,
        });
        return;
      }
    }

    if (employeData.password !== employeData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match.",
      });
      // setError('Passwords do not match.');
      return;
    }

    const currentDate = new Date().toISOString();
    const dataWithDate = { ...employeData, createDate: currentDate };
    const { confirmPassword, ...dataToSubmit } = dataWithDate;

    dispatch(createData(dataToSubmit))
      .unwrap()
      .then(() => {
        Swal.fire({
          title: "Employee Created!",
          text: `Employee ID: ${dataWithDate.employeId}`,
          icon: "success",
          confirmButtonText: "OK",
        });
        setEmployeData(initialEmployeData);
      })
      .catch(() => {
        Swal.fire({
          title: "Error",
          text: error || "Something went wrong!",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Paper
        elevation={10}
        className="p-8 w-[900px] bg-white rounded-2xl shadow-lg"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Create Employee
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex gap-4">
              <TextField
                label="First Name"
                name="firstName"
                value={employeData.firstName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
              />

              <TextField
                label="Middle Name"
                name="middlename"
                value={employeData.middlename}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
              />

              <TextField
                label="Last Name"
                name="lastName"
                value={employeData.lastName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
              />
            </div>

            <TextField
              label="Username"
              name="username"
              value={employeData.username}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              className="bg-gray-50 rounded-md"
              InputLabelProps={{ className: "text-gray-600" }}
              inputProps={{ autoComplete: "new-username" }}
              required
            />

            <div className="flex gap-4">
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={employeData.phoneNumber}
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
                value={employeData.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
                required
              />
            </div>

            <div className="flex gap-[15px]">
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={employeData.dateOfBirth}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ shrink: true, className: "text-gray-600" }}
                required
              />

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
                  value={employeData.gender}
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
            </div>

            <div className="flex gap-[15px]">
              <TextField
                label="Aadhaar Card Number"
                name="aadhaarCard"
                value={employeData.aadhaarCard}
                onChange={handleChange}
                type="text"
                fullWidth
                variant="outlined"
                inputProps={{ maxLength: 12, minLength: 12 }}
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
              />

              <TextField
                label="Address"
                name="address"
                value={employeData.address}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
              />
            </div>

            <TextField
              label="Password"
              name="password"
              type="password"
              value={employeData.password}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              className="bg-gray-50 rounded-md"
              InputLabelProps={{ className: "text-gray-600" }}
              inputProps={{ autoComplete: "new-password" }}
              required
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
              fullWidth
              value={employeData.confirmPassword}
              onChange={handleChange}
              autoComplete="off"
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="mt-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {status === "loading" ? "Creating..." : "Create Employee"}
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default EmployerCreate;
