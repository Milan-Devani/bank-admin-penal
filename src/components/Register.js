import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Grid, TextField, Button } from "@mui/material";
import Swal from "sweetalert2";
import bgimg from "../assets/img/blur-img.jpeg";
import { createData, getdata } from "./admin/slices/adminSlice";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dataList, status, error } = useSelector((state) => state.admin);
  const userList = dataList?.filter((user) => user.role === "user");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    currentdate: new Date().toISOString().slice(0, 10),
    dateOfBirth: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  useEffect(() => {
    dispatch(getdata());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (form.password !== form.confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Passwords do not match.",
        });
        return;
      }

      const response = await axios.get(`http://localhost:5000/auth?username=${form.username}`);
      const existingUser = response.data;

      if (existingUser.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Username already exists.",
        });
        return;
      }

      const newUser = {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        currentdate: form.currentdate,
        dateOfBirth: form.dateOfBirth,
        phoneNumber: form.phoneNumber,
        password: form.password,
        role: form.role,
      };

      dispatch(createData(newUser)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          Swal.fire({
            title: "Account created!",
            text: "Account created successfully! Redirecting to login...",
            icon: "success",
          });
          setTimeout(() => navigate("/login"), 2000);
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed to create account",
            text: error || "Failed to create account. Please try again.",
          });
        }
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
    <div
      style={{ backgroundImage: `url(${bgimg})` }}
      className="bg-cover bg-center h-screen"
    >
      <div className="w-[700px] pt-[50px] mx-auto d-block">
        <div
          className="py-[20px] px-[20px] backdrop-blur-md bg-white/20 relative z-[1] border rounded-2xl"
        >
          <h2
            className="text-center text-zinc-500 text-[42px] mb-[20px]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            USER REGISTRATION
          </h2>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  variant="outlined"
                  fullWidth
                  value={form.firstName}
                  onChange={handleChange}
                  InputProps={{
                    style: {
                      backgroundColor: "transparent",
                      border: "1px solid rgb(113 113 122)",
                      borderRadius: "10px",
                      color: "rgb(113 113 122)",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  variant="outlined"
                  fullWidth
                  value={form.lastName}
                  onChange={handleChange}
                  InputProps={{
                    style: {
                      backgroundColor: "transparent",
                      border: "1px solid rgb(113 113 122)",
                      borderRadius: "10px",
                      color: "rgb(113 113 122)",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  name="username"
                  variant="outlined"
                  fullWidth
                  value={form.username}
                  onChange={handleChange}
                  InputProps={{
                    style: {
                      backgroundColor: "transparent",
                      border: "1px solid rgb(113 113 122)",
                      borderRadius: "10px",
                      color: "rgb(113 113 122)",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={form.email}
                  onChange={handleChange}
                  InputProps={{
                    style: {
                      backgroundColor: "transparent",
                      border: "1px solid rgb(113 113 122)",
                      borderRadius: "10px",
                      color: "rgb(113 113 122)",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  value={form.phoneNumber}
                  inputProps={{ maxLength: 10, minLength: 10 }}
                  onChange={handleChange}
                  InputProps={{
                    style: {
                      backgroundColor: "transparent",
                      border: "1px solid rgb(113 113 122)",
                      borderRadius: "10px",
                      color: "rgb(113 113 122)",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  InputProps={{
                    style: {
                      backgroundColor: "transparent",
                      border: "1px solid rgb(113 113 122)",
                      borderRadius: "10px",
                      color: "rgb(113 113 122)",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="off"
                  InputProps={{
                    style: {
                      backgroundColor: "transparent",
                      border: "1px solid rgb(113 113 122)",
                      borderRadius: "10px",
                      color: "rgb(113 113 122)",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="off"
                  InputProps={{
                    style: {
                      backgroundColor: "transparent",
                      border: "1px solid rgb(113 113 122)",
                      borderRadius: "10px",
                      color: "rgb(113 113 122)",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Registering..." : "Register"}
                </Button>
              </Grid>
            </Grid>
          </form>
          <Typography
            variant="body2"
            style={{ color: "rgb(113 113 122)", marginTop: "20px" }}
          >
            <strong>Already have an account ?</strong>{" "}
            <Link className="text-blue-600 underline" to="/login">
              Login here
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Register;
