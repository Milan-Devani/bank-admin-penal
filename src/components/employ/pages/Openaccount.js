import React, { useState, useEffect } from "react";
import { TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Paper } from "@mui/material";
import "tailwindcss/tailwind.css";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { createBankAccount,fetchBankAccount } from "../slices/Employerslices";
// import EmployerCreate from "../../admin/pages/EmployerCreate";

const OpenAccount = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.users);
  const user = useSelector((state) => state.user.user);
  const { users: data, status } = useSelector((state) => state.bankAccount);

  // console.log("logindata", user.username);
  // console.log("bank account" , data);
  


  const initialFormData = {
    firstName: "",
    lastName: "",
    middlename: "",
    dob: "",
    idType: "",
    idNumber: "",
    address: "",
    gender: "",
    pannumber:"",
    accountType: "",
    Employeeusername: user.username,
    Employeeid: user.employeId,
    accountopendate: new Date().toLocaleDateString(),
    accountNumber: "",
    initialDeposit: "",
    email: "",
    age: "",
    pin: "",
    number: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({
    initialDeposit: "",
    email: "",
    idNumber: "",
  });

  // console.log("createed accout", formData);


  useEffect(() => {
    dispatch(fetchBankAccount())
    const accountNumber = generateAccountNumber();
    const pin = generatePin(accountNumber);
    setFormData((prevData) => ({
      ...prevData,
      accountNumber,
      pin,
    }));
  }, [dispatch]);

  function generateAccountNumber() {
    return Math.floor(100000000000 + Math.random() * 550000000000).toString();
  }

  function generatePin(accountNumber) {
    const last6Digits = accountNumber.slice(-6);
    return last6Digits;
  }

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "dob") {
      const age = calculateAge(value);
      setFormData((prevData) => ({ ...prevData, age }));
    }

    if (name === "initialDeposit" && value < 2000) {
      setErrors({
        ...errors,
        initialDeposit: "Minimum deposit amount is 2000",
      });
    } else {
      setErrors({ ...errors, initialDeposit: "" });
    }
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.initialDeposit < 2000) {
      setErrors({
        ...errors,
        initialDeposit: "Minimum deposit amount is 2000",
      });
      return;
    }
  
    if (errors.idNumber) {
      alert("Please correct the errors before submitting.");
      return;
    }
  
    // Check for duplicate ID Number
    const isDuplicateID = data.some(
      (account) => account.idType === formData.idType && account.idNumber === formData.idNumber
    );
  
    if (isDuplicateID) {
      Swal.fire({
        title: "Bank Account already existed",
        text: "An account with the same ID Number already exists.",
        icon: "error",
      });
      return;
    }
  
    // Check for duplicate PAN Number
    const isDuplicatePAN = data.some(
      (account) => account.pannumber === formData.pannumber
    );
  
    if (isDuplicatePAN) {
      Swal.fire({
        title: "Bank Account already existed",
        text: "An account with the same PAN Number already exists.",
        icon: "error",
      });
      return;
    }
  
    // Dispatch createBankAccount if no duplicates are found
    dispatch(createBankAccount(formData)).then((result) => {
      if (createBankAccount.fulfilled.match(result)) {
        Swal.fire({
          title: `Account Number ${formData.accountNumber}`,
          text: "Account created successfully!",
          icon: "success",
        });
        resetForm();
      } else {
        alert("Failed to create account.");
      }
    });
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center p-3">
      <Paper elevation={10} className="p-8 w-[900px] bg-white rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-[10px]">Open Bank Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex">
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
                required
              />

              <TextField
                label="Middle Name"
                name="middlename"
                value={formData.middlename}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md sas"
                InputLabelProps={{ className: "text-gray-600" }}
                required
              />

              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
                required
              />
            </div>

            <div className="flex gap-[10px]">
              <TextField
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ shrink: true, className: "text-gray-600" }}
                required
              />

              <TextField
                label="Pan card Number"
                name="pannumber"
                value={formData.pannumber}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                inputProps={{ maxLength: 10, minLength: 10 }}
                InputLabelProps={{ className: "text-gray-600" }}
                required
              />
            </div>

            <FormControl
              component="fieldset"
              fullWidth
              className="bg-gray-50 rounded-md"
            >
              <FormLabel component="legend" className="text-gray-600">
                Account Type
              </FormLabel>
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
                />
                <FormControlLabel
                  value="CurrentAccount"
                  control={<Radio />}
                  label="Current Account"
                />
                <FormControlLabel
                  value="SalaryAccount"
                  control={<Radio />}
                  label="Salary Account"
                />
                <FormControlLabel
                  value="FixedDepositAccount"
                  control={<Radio />}
                  label="Fixed Deposit Account"
                />
              </RadioGroup>
            </FormControl>

            <div className="flex">
              <FormControl
                component="fieldset"
                fullWidth
                className="bg-gray-50 rounded-md"
              >
                <FormLabel component="legend" className="text-gray-600">
                  ID Type
                </FormLabel>
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

                  />
                  <FormControlLabel
                    value="voter"
                    control={<Radio />}
                    label="Voter ID"
                  />
                </RadioGroup>
              </FormControl>

              <FormControl
                component="fieldset"
                fullWidth
                className="bg-gray-50 rounded-md gender-margin"
              >
                <FormLabel component="legend" className="text-gray-600">
                  Gender
                </FormLabel>
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
                  />
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <div className="flex gap-[25px]">
              <TextField
                label={
                  formData.idType === "aadhaar"
                    ? "Aadhaar Number"
                    : "Voter ID Number"
                }
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                inputProps={{
                  maxLength: formData.idType === "aadhaar" ? 12 : 10,
                  minLength: formData.idType === "aadhaar" ? 12 : 10,
                }}
                InputLabelProps={{ className: "text-gray-600" }}
                error={Boolean(errors.idNumber)}
                helperText={errors.idNumber}
                required
              />
              <TextField
                label="Phone Number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                inputProps={{ maxLength: 10, minLength: 10 }}
                InputLabelProps={{ className: "text-gray-600" }}
                required
              />
            </div>

            <div className="flex gap-[30px]">
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
                required
              />

              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="bg-gray-50 rounded-md"
                InputLabelProps={{ className: "text-gray-600" }}
                error={Boolean(errors.email)}
                helperText={errors.email}
                required
              />
            </div>

            <TextField
              label="Initial Deposit"
              name="initialDeposit"
              value={formData.initialDeposit}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              type="number"
              className="bg-gray-50 rounded-md"
              InputLabelProps={{ className: "text-gray-600" }}
              error={Boolean(errors.initialDeposit)}
              helperText={errors.initialDeposit}
              required
            />

            <div className="mb-[10px]">
              <Button type="submit" variant="contained" color="primary" className="w-full mt-[20px]">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default OpenAccount;

