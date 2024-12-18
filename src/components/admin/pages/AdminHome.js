import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { getdata } from "../slices/adminSlice";
import { fetchBankAccount } from "../../employ/slices/Employerslices";
import { fetchTransactions } from "../slices/bankFundSlice";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "react-circular-progressbar/dist/styles.css";
// import Adminchart from './Adminchart';
import Bankanalytics from "./BankAccountanalytics";
import BankAccountlist from "../../employ/pages/BankAccountlist";
import EmployesList from "./EmployesList";
import Useranalyticschart from "./Useranalyticschart";

const useStyles = makeStyles({
  card: {
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
});

function AdminHome() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [openBankAccountDialog, setOpenBankAccountDialog] = useState(false);
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [filterType, setFilterType] = useState("bankAccounts"); 
  const [selectedOption, setSelectedOption] = useState("bank");
  const { users: data, status } = useSelector((state) => state.bankAccount);
  const { dataList } = useSelector((state) => state.admin);
  const transactions = useSelector((state) => state.bankFund.transactions);

  const users = dataList.filter((item) => item.role === "user");

  // Filter employee
  const employers = dataList.filter((item) => item.role === "employer");

  // Filter admin
  const admins = dataList.filter((item) => item.role === "admin");

  const loading = status === "loading";
  const TotalBanckAccounts = data?.length || 0;
  const TotalAdmin = admins?.length || 0;
  const TotalEmployers = employers?.length || 0;
  const TotalVisitors = users?.length || 0;

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    dispatch(fetchBankAccount());
    dispatch(getdata());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const filterUsers = () => {
    if (!users || users.length === 0) return [];

    const now = dayjs();
    let filteredusers = [];

    switch (dateFilter) {
      case "all":
        filteredusers = users;
        break;
      case "7":
        filteredusers = users.filter((user) =>
          dayjs(user.currentdate).isAfter(now.subtract(7, "day"))
        );
        break;
      case "15":
        filteredusers = users.filter((user) =>
          dayjs(user.currentdate).isAfter(now.subtract(15, "day"))
        );
        break;
      case "30":
        filteredusers = users.filter((user) =>
          dayjs(user.currentdate).isAfter(now.subtract(30, "day"))
        );
        break;
      case "182":
        filteredusers = users.filter((user) =>
          dayjs(user.currentdate).isAfter(now.subtract(182, "day"))
        );
        break;
      case "365":
        filteredusers = transactions.filter((user) =>
          dayjs(user.currentdate).isAfter(now.subtract(1, "year"))
        );
        break;
      case "custom":
        const { start, end } = customRange;
        if (start && end) {
          filteredusers = users.filter(
            (user) =>
              dayjs(user.currentdate).isAfter(dayjs(start)) &&
              dayjs(user.currentdate).isBefore(dayjs(end))
          );
        }
        break;
      default:
        filteredusers = [];
    }

    return filteredusers;
  };

  const filterTransactions = () => {
    if (!transactions || transactions.length === 0) return [];

    const now = dayjs();
    let filteredTransactions = [];

    switch (dateFilter) {
      case "all":
        filteredTransactions = transactions;
        break;
      case "7":
        filteredTransactions = transactions.filter((transaction) =>
          dayjs(transaction.date).isAfter(now.subtract(7, "day"))
        );
        break;
      case "15":
        filteredTransactions = transactions.filter((transaction) =>
          dayjs(transaction.date).isAfter(now.subtract(15, "day"))
        );
        break;
      case "30":
        filteredTransactions = transactions.filter((transaction) =>
          dayjs(transaction.date).isAfter(now.subtract(30, "day"))
        );
        break;
      case "182":
        filteredTransactions = transactions.filter((transaction) =>
          dayjs(transaction.date).isAfter(now.subtract(182, "day"))
        );
        break;
      case "365":
        filteredTransactions = transactions.filter((transaction) =>
          dayjs(transaction.date).isAfter(now.subtract(1, "year"))
        );
        break;
      case "custom":
        const { start, end } = customRange;
        if (start && end) {
          filteredTransactions = transactions.filter(
            (transaction) =>
              dayjs(transaction.date).isAfter(dayjs(start)) &&
              dayjs(transaction.date).isBefore(dayjs(end))
          );
        }
        break;
      default:
        filteredTransactions = [];
    }

    return filteredTransactions;
  };

  const filterBankaccount = () => {
    if (!data) return [];

    const now = dayjs();
    let filteredBankaccount = [];

    if (dateFilter === "all") {
      filteredBankaccount = data;
    } else if (dateFilter === "7") {
      filteredBankaccount = data.filter((date) =>
        dayjs(date.accountopendate).isAfter(now.subtract(7, "day"))
      );
    } else if (dateFilter === "15") {
      filteredBankaccount = data.filter((date) =>
        dayjs(date.accountopendate).isAfter(now.subtract(15, "day"))
      );
    } else if (dateFilter === "30") {
      filteredBankaccount = data.filter((date) =>
        dayjs(date.accountopendate).isAfter(now.subtract(30, "day"))
      );
    } else if (dateFilter === "182") {
      filteredBankaccount = data.filter((date) =>
        dayjs(date.accountopendate).isAfter(now.subtract(182, "day"))
      );
    } else if (dateFilter === "365") {
      filteredBankaccount = data.filter((date) =>
        dayjs(date.accountopendate).isAfter(now.subtract(1, "year"))
      );
    } else if (dateFilter === "custom") {
      const { start, end } = customRange;
      filteredBankaccount = data.filter(
        (date) =>
          dayjs(date.accountopendate).isAfter(dayjs(start)) &&
          dayjs(date.accountopendate).isBefore(dayjs(end))
      );
    }

    return filteredBankaccount;
  };

  if (loading) {
    return <p>Loading....</p>;
  }

  if (!data || data.length === 0) {
    return <p>No bank account data available.</p>;
  }

  const totalData = {
    bankAccounts: TotalBanckAccounts,
    users: 800,
    admins: TotalAdmin,
    employees: TotalEmployers,
    visitors: TotalVisitors,
  };

  const filterUser = filterUsers();
  const filteredTransactions = filterTransactions();
  const filteredBankAccounts = filterBankaccount();

  console.log("filterUser", filterUser);

  return (
    <div className="h-[705px] flex flex-col items-center bg-gray-100 p-4">
     {/* -=-=-=-=-=-=-=-=-=-=-=-=-Bank account Card-=-=-=-=-=-=-=-=-=-=-=-=- */}
      <div className="w-[1100px] relative right-[35px] flex gap-[30px]">
        <Grid className="w-[25%] h-[180px]" item xs={12} sm={6} md={3}>
          <div
            className="h-full cursor-pointer"
            onClick={() => setOpenBankAccountDialog(true)}
          >
            <Card
              className={`h-full shadow-lg border-t-4 border-blue-500 ${classes.card}`}
            >
              <CardContent className="bg-white p-6">
                <Typography variant="h6" className="text-gray-700">
                  Total Bank Accounts
                </Typography>
                <Typography variant="h3" className="text-blue-500 mt-2">
                  {TotalBanckAccounts}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Grid>
        <Dialog
          style={{
            maxWidth: "fit-content",
            maxHeight: "100%",
            display: "block",
            margin: "0 auto",
          }}
          open={openBankAccountDialog}
          onClose={() => setOpenBankAccountDialog(false)}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle style={{ paddingBottom: "0", paddingTop: "8px" }}>
            Total Bank Accounts
          </DialogTitle>
          <DialogContent style={{ paddingLeft: "5px", paddingRight: "5px" }}>
            <BankAccountlist />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenBankAccountDialog(false)}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* -=-=-=-=-=-=-=-=-=-=-=-=-Admins Card-=-=-=-=-=-=-=-=-=-=-=-=- */}
        <Grid className="w-[25%] h-[180px]" item xs={12} sm={6} md={3}>
          <div
            className="h-full cursor-pointer"
            onClick={() => setOpenAdminDialog(true)}
          >
            <Card
              className={`h-full shadow-lg border-t-4 border-purple-500 ${classes.card}`}
            >
              <CardContent className="bg-white p-6">
                <Typography variant="h6" className="text-gray-700">
                  Total Admins
                </Typography>
                <Typography variant="h3" className="text-blue-500 mt-2">
                  {totalData.admins}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Grid>
        <Dialog
          style={{
            maxWidth: "1300px",
            maxHeight: "100%",
            display: "block",
            margin: "0 auto",
            padding: "10px",
          }}
          open={openAdminDialog}
          onClose={() => setOpenAdminDialog(false)}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle style={{ paddingBottom: "0", paddingTop: "8px" }}>
            Total Admin
          </DialogTitle>
          <DialogContent
            style={{ height: "800px", paddingLeft: "5px", paddingRight: "5px" }}
          >
            <BankAccountlist />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAdminDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* -=-=-=-=-=-=-=-=-=-=-=-=-Employees Card-=-=-=-=-=-=-=-=-=-=-=-=- */}

        <Grid className="w-[25%] h-[180px]" item xs={12} sm={6} md={3}>
          <div
            className="h-full cursor-pointer"
            onClick={() => setOpenEmployeeDialog(true)}
          >
            <Card
              className={`h-full shadow-lg border-t-4 border-purple-500 ${classes.card}`}
            >
              <CardContent className="bg-white p-6">
                <Typography variant="h6" className="text-gray-700">
                  Total Employees
                </Typography>
                <Typography variant="h3" className="text-blue-500 mt-2">
                  {totalData.employees}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Grid>
        <Dialog
          style={{
            maxWidth: "1300px",
            maxHeight: "100%",
            display: "block",
            margin: "0 auto",
            padding: "10px",
          }}
          open={openEmployeeDialog}
          onClose={() => setOpenEmployeeDialog(false)}
          fullWidth
          maxWidth="lg"
        >
          <DialogContent
            style={{ height: "800px", paddingLeft: "5px", paddingRight: "5px" }}
          >
            <EmployesList />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenEmployeeDialog(false)}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div className="mt-[50px] w-full">
        <div className="flex">
          <div className="flex gap-[20px]">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Analytics Overview
            </h2>
            <div>
              <FormControl variant="outlined" className="mb-4">
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  label="Date Range"
                >
                  <MenuItem value="all">All Days</MenuItem>
                  <MenuItem value="7">Last 7 Days</MenuItem>
                  <MenuItem value="15">Last 15 Days</MenuItem>
                  <MenuItem value="30">Last 30 Days</MenuItem>
                  <MenuItem value="182">Last 6 Months</MenuItem>
                  <MenuItem value="365">Last 1 Year</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>

              {dateFilter === "custom" && (
                <div className="flex gap-4">
                  <TextField
                    label="Start Date"
                    type="date"
                    variant="outlined"
                    value={customRange.start}
                    onChange={(e) =>
                      setCustomRange({ ...customRange, start: e.target.value })
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    label="End Date"
                    type="date"
                    variant="outlined"
                    value={customRange.end}
                    onChange={(e) =>
                      setCustomRange({ ...customRange, end: e.target.value })
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex flex-wrap gap-8">
          <div>
            <div className="bg-gradient-to-r from-green-500 to-green-400 text-white p-6 h-[180px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 mb-[15px]">
              <h3 className="text-xl font-bold">Bank account</h3>
              <p className="mt-4 text-4xl font-bold">
                {filteredBankAccounts.length}
              </p>
              <p className="text-sm mt-2">
                Filtered by{" "}
                {dateFilter === "custom"
                  ? "Custom Range"
                  : `Last ${dateFilter} Days`}
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-400 text-white p-6 h-[180px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 mt-[15px]">
              <h3 className="text-xl font-bold">Visiter data</h3>
              <p className="mt-4 text-4xl font-bold">{filterUser.length}</p>
              <p className="text-sm mt-2">
                Filtered by{" "}
                {dateFilter === "custom"
                  ? "Custom Range"
                  : `Last ${dateFilter} Days`}
              </p>
            </div>
          </div>

          <div className="ml-[50px]">
            <div className="flex items-center space-x-4">
              <label>
                <input
                  type="radio"
                  value="bank"
                  checked={selectedOption === "bank"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Bank Analytics
              </label>
              <label>
                <input
                  type="radio"
                  value="user"
                  checked={selectedOption === "user"}
                  onChange={handleChange}
                  className="mr-2"
                />
                User Analytics Chart
              </label>
            </div>

            <div className="">
              {selectedOption === "bank" && <Bankanalytics />}
              {selectedOption === "user" && <Useranalyticschart />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;