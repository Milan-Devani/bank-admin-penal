import React, { useState } from 'react';
import { Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../LoginSlices/loginReducer';
import bankicon from '../../assets/img/bank.png'
import SearchIcon from '@mui/icons-material/Search';
import { FaUserCircle } from 'react-icons/fa';

const EmployerDashboard = ({ employprop }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState('Openaccount');
  const navigate = useNavigate();

    const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const location = useLocation();
  const { user } = location.state || {};

  const data = [
    {
      functionName: "Openaccount",
      name: "Create Bank account",
    },
    {
      functionName: "BankAccountlist",
      name: "BankAccountlist",
    },
    {
      functionName: "Updateaccountdetails",
      name: "Find Account details",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleClick = (functionName) => {
    setSelectedPage(functionName);
    employprop(functionName);
  };

  return (
    <div className="w-[290px] h-screen bg-gray-800 text-white flex flex-col py-4">
     <div className='flex items-center mx-auto gap-[15px] border-b border-gray-700'>
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
          <h1>Employee Dashboard</h1>
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
                <div className="w-[25px] h-[25px]"><img src={bankicon} alt="Bank Icon" /></div>
              ) : ind === 1 ? (
                <FormatListBulletedIcon className="text-white" />
              ) : ind === 2 ? (
                <SearchIcon className="text-white" />
              ) : (
                <ReceiptIcon className="text-white" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              style={{
                transition: 'all 0.2s',
                marginLeft: selectedPage === item.functionName ? '10px' : '0',
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
        >
          Logout
        </Button>
      </div>


      <div className="text-center py-4 border-t border-gray-700">
        © 2024 employ Panel
      </div>
    </div>
  );
};

export default EmployerDashboard;