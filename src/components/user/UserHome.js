// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { updateBalance, addTransaction } from './accountSlice';
// import axios from 'axios';

// function Withdrawal() {
//   const [withdrawalAmount, setWithdrawalAmount] = useState('');
//   const { accountData, isVerified } = useSelector((state) => state.account);
//   const dispatch = useDispatch();

//   const id = accountData.id;
//   const name = accountData.firstName + ' ' + accountData.lastName;
//   const currentBalance = accountData.initialDeposit;
//   const accountLastDigit = accountData.accountNumber.slice(-4); // Assuming accountNumber exists

//   const handleWithdrawal = async () => {
//     const amount = parseFloat(withdrawalAmount);
//     if (amount > 0 && amount <= currentBalance) {
//       const updatedBalance = currentBalance - amount;

//       try {
//         // Send a PATCH request to update only the balance in the database
//         await axios.patch(`http://localhost:5000/bankaccount/${id}`, {
//           initialDeposit: updatedBalance
//         });

//         // Save the transaction
//         const transaction = {
//           id: Date.now(), // Unique ID for the transaction
//           date: new Date().toLocaleDateString(),
//           time: new Date().toLocaleTimeString(),
//           type: 'Withdrawal',
//           amount: `₹${amount}`,
//           accountLastDigit,
//         };

//         // Save transaction to API
//         await axios.post('http://localhost:5000/transactions', transaction);

//         // Update the balance in Redux state
//         dispatch(updateBalance({ id, amount: updatedBalance }));

//         // Optionally, save the transaction in Redux state
//         dispatch(addTransaction(transaction));

//         setWithdrawalAmount('');
//         alert(`Withdrawal of ₹${amount} was successful!`);
//       } catch (error) {
//         alert('There was an error processing your withdrawal. Please try again.');
//         console.error('API error:', error);
//       }
//     } else {
//       alert('Invalid amount or insufficient balance');
//     }
//   };

//   return (
//     <div>
//       <h1>Account Holder Name: {name}</h1>
//       {isVerified ? <p>Account is verified!</p> : <p>Account not verified</p>}
      
//       <div>
//         <h2>Current Balance: ₹{currentBalance}</h2>
//         <input 
//           type="number" 
//           placeholder="Enter amount to withdraw" 
//           value={withdrawalAmount}
//           onChange={(e) => setWithdrawalAmount(e.target.value)}
//         />
//         <button onClick={handleWithdrawal}>Withdraw</button>
//       </div>
//     </div>
//   );
// }

// export default Withdrawal;





// import React, { useState } from "react";
// import Dashboard from "./Dashboard";
// import Balance from "./pages/Balance";
// import Transactions from "./pages/Transactions";
// import Withdrawal from "./pages/Withdrawal";

// const UserHome = () => {
//   const [selectedSection, setSelectedSection] = useState("Balance");

//   const renderContent = () => {
//     switch (selectedSection) {
//       case "withdrawal":
//         return <Withdrawal />;
//       case "balance":
//         return <Balance />;
//       case "transactions":
//         return <Transactions />;
//       default:
//         return <Balance />;
//     }
//   };

//   return (
//     <div>
//       <div className="user-home flex">
//         <Dashboard onSelect={setSelectedSection} />
//         <div className="flex-1 bg-gray-100 p-4">{renderContent()}</div>
//       </div>
//     </div>
//   );
// };

// export default UserHome;
