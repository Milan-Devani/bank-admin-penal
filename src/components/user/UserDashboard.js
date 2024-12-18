import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccountInfo } from "./Slice/accountSlice";
import depositicon from '../../assets/img/donation.png';
import swapicon from '../../assets/img/lending.png';
import transactionsicon from '../../assets/img/transaction-history.png';
import pinicon from '../../assets/img/password.png'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ReceiptIcon from "@mui/icons-material/Receipt";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar, faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';
import { FaUserCircle } from "react-icons/fa";

const UserDashboard = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { auth, logout } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [openPopup, setOpenPopup] = useState(true);
  const [error, setError] = useState("");
  const [formacnum, setFormacnum] = useState({ accountNumber: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [accountVerified, setAccountVerified] = useState(false);
  const [pendingRoute, setPendingRoute] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedPage, setSelectedPage] = useState("withdrawal");

  const location = useLocation();
  const { user } = location.state || {};

  const menuItems = [
    { functionName: "BankToBankTransfer", name: "Bank To Bank Transfer" },
    { functionName: "withdrawal", name: "Withdrawal" },
    { functionName: "Deposit", name: "Deposit" },
    { functionName: "balance", name: "Current Balance" },
    { functionName: "transactions", name: "Transactions" },
    { functionName: "Changepin", name: "Change PIN" },
    { functionName: "TransactionChart", name: "Transaction Analysis" },
  ];

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth");
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        if (error.response && error.response.status === 401) {
          logout();
          navigate("/login");
        }
      }
    };
    fetchComments();

    return () => {
      setComments([]);
    };
  }, [auth.token, logout, navigate]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormacnum({ ...formacnum, [e.target.name]: e.target.value });
    setError("");
    setSuccessMessage("");
  };

  const handleOpenPopup = (route) => {
    setPendingRoute(route);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setFormacnum({ accountNumber: "" });
    setError("");
    setSuccessMessage("");
  };

  const handleSubmitAccountNumber = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:5000/bankaccount?accountnum=${formacnum.accountNumber}`
      );
      const users = response.data;

      const user = users.find(
        (user) => user.accountNumber === formacnum.accountNumber
      );

      if (user) {
        setAccountVerified(true);
        setSuccessMessage("Account verified successfully!");
        setError("");

        dispatch(setAccountInfo(user));

        handleClosePopup();
        if (pendingRoute) {
          onSelect(pendingRoute);
        }
      } else {
        setError("Invalid account number.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
      setSuccessMessage("");
    }
  };

  const handleRouteSelection = (functionName) => {
    if (accountVerified) {
      onSelect(functionName);
      setSelectedPage(functionName);
    } else {
      handleOpenPopup(functionName);
    }
  };


  return (
    <div className="flex">
      <div className="w-[290px] bg-gray-800 text-white h-full">
        <div className='flex justify-center items-center mx-auto gap-[15px] border-b border-gray-700'>
          <div>
            {user && (
              <div className="relative z-[45]">
                <FaUserCircle
                  size={28}
                  className="cursor-pointer hover:text-indigo-900"
                  onClick={toggleDropdown}
                />
                {isOpen && (
                  <div className="absolute left-[20px] mt-2 w-48 bg-white border rounded-lg shadow-lg py-[15px] px-[20px]">
                    <p className="text-gray-700 font-semibold">
                      <strong> User Name:</strong> {(user.username) ?? 'N/A'}
                    </p>
                    <p className="text-gray-600">
                      <strong>Role:</strong> {(user.role) ?? 'N/A'}
                    </p>
                    <div className="p-4">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="text-center py-6 text-2xl font-bold ">
            <h1>user Dashboard</h1>
          </div>
        </div>
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              className="cursor-pointer"
              button={true}
              onClick={() => handleRouteSelection(item.functionName)}
              disabled={!accountVerified}
              style={{
                backgroundColor:
                  selectedPage === item.functionName ? "#1c3558" : "",
                transition: "all 0.2s",
              }}
            >
              <ListItemIcon>
                {index === 0 ? (
                  <div className="w-[25px] h-[25px]"><img src={swapicon} alt="B2B Icon" /></div>
                ) : index === 1 ? (
                  <FontAwesomeIcon icon={faHandHoldingDollar} style={{ color: "#ffffff" }} />
                ) : index === 2 ? (
                  <div className="w-[25px] h-[25px]"><img src={depositicon} alt="Deposit Icon" /></div>
                ) : index === 3 ? (
                  <CurrencyRupeeIcon className="text-white" />
                ) : index === 4 ? (
                  <div className="w-[25px] h-[25px]"><img src={transactionsicon} alt="transactions Icon" /></div>
                ) : index === 5 ? (
                  <div className="w-[25px] h-[25px]"><img src={pinicon} alt="pin Icon" /></div>
                ) : (
                  <AnalyticsIcon className="text-white" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                style={{
                  marginLeft: selectedPage === item.functionName ? "10px" : "0",
                }}
              />
            </ListItem>
          ))}
        </List>
        <div className="mt-4 p-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            disabled={!accountVerified}
          >
            Logout
          </Button>
        </div>
      </div>

      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>Enter Your Account Number</DialogTitle>
        <DialogContent>
          <TextField
            label="Account Number"
            name="accountNumber"
            variant="outlined"
            fullWidth
            value={formacnum.accountNumber}
            onChange={handleChange}
            required
            error={!!error}
            helperText={error || successMessage}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitAccountNumber} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
