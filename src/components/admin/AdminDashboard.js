import React, { useState } from 'react';
import { Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { FaUserCircle } from 'react-icons/fa';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../LoginSlices/loginReducer';

const AdminDashboard = ({ prop }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState('EmployesList');
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const location = useLocation();
  const { user } = location.state || {};

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const data = [
    {
      functionName: "AdminHome",
      name: "Home",
    },
    {
      functionName: "BankFund",
      name: "Bank Fund",
    },
    {
      functionName: "BankAccountlist",
      name: "Bank Account list",
    },
    {
      functionName: "create-admin",
      name: "Create Admin account",
    },
    {
      functionName: "AdminList",
      name: "Admin List",
    },
    {
      functionName: "EmployerCreate",
      name: "Create employer account",
    },
    {
      functionName: "EmployesList",
      name: "Employes List",
    },
  ];

  const handleClick = (functionName) => {
    setSelectedPage(functionName);
    prop(functionName);
  };

  return (
    <div className="w-[290px] h-screen bg-gray-800 text-white flex flex-col">
      <div className='flex items-center mx-auto gap-[15px]'>
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
        <div className="text-center py-6 text-2xl font-bold border-b border-gray-700">
          <h1>Admin Dashboard</h1>
        </div>
      </div>

      <List className="flex-1">
        {data.map((item, ind) => (
          <ListItem
            key={ind}
            className="cursor-pointer"
            button={true}
            onClick={() => handleClick(item.functionName)}
            style={{
              transition: 'all 0.2s',
              backgroundColor: selectedPage === item.functionName ? '#1c3558' : ''
            }}
          >
            <ListItemIcon>
              {ind === 0 ? (
                <HomeIcon className="text-white" />
              ) : ind === 1 ? (
                <AccountBalanceIcon className="text-white" />
              ) : ind === 2 ? (
                <FormatListBulletedIcon className="text-white" />
              ) : ind === 3 || ind === 5 ? (
                <AddBoxIcon className="text-white" />
              ) : ind === 4 || ind === 6 ? (
                <FormatListBulletedIcon className="text-white" />
              ) : (
                <AnalyticsIcon className="text-white" />
              )}
            </ListItemIcon>
            <ListItemText primary={item.name}
              style={{
                transition: 'all 0.2s',
                marginLeft: selectedPage === item.functionName ? '10px' : '0',
              }}
            />
          </ListItem>
        ))}
        <div className="mt-4 p-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </List>
      <div className="text-center py-4 border-t border-gray-700">
        © 2024 Admin Panel
      </div>
    </div>
  );
};

export default AdminDashboard;
