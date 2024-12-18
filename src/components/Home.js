import React from "react";
import { TextField, Button, Grid, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-[#1f2937]">
      <div className="px-[50px] flex justify-between items-center py-[5px]">
        <h1 className="text-white text-[35px]">APNA BANK</h1>
        <div>
          <Button className="home-btn" variant="contained">
            <Link to="/register">Sign Up</Link>
          </Button>
        </div>
      </div>
      <div className="h-[667px] justify-center items-center flex w-100vw">
        <div className="">
          <h1 className="text-[3vw] text-[white]">Welcome To The Appna Bank</h1>
          <Button className="home-btn" variant="contained">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
