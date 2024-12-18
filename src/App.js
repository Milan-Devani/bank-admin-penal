import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashboard from "./components/user/UserDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import Unauthorized from "./components/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import EmployerDashboard from "./components/employ/EmployerDashboard";
import Withdrawal from "./components/user/pages/Withdrawal";
import Balance from "./components/user/pages/Balance"; // Assuming this is a component
import Transactions from "./components/user/pages/Transactions";
// import UseradminCreate from "./components/admin/pages/UseradminCreate";
// import UseradminList from "./components/admin/pages/UseradminList";
// import BankAccout from "./components/employ/pages/BankAccout";
import Openaccount from "./components/employ/pages/Openaccount";
import Updateaccountdetails from "./components/employ/pages/Updateaccountdetails";
import Deposit from "./components/user/pages/Deposit";
import Changepin from "./components/user/pages/Changepin";
import EmployerCreate from "./components/admin/pages/EmployerCreate";
// import EmployeesList from "./components/admin/pages/UseradminList";
import EmployesList from "./components/admin/pages/EmployesList";
import CreateAdmin from "./components/admin/pages/CreateAdmin";
import AdminList from "./components/admin/pages/AdminList";
import BankToBankTransfer from "./components/user/pages/BankToBankTransfer";
import BankFund from "./components/admin/pages/BankFund";
import AdminHome from "./components/admin/pages/AdminHome";
import BankAccountlist from "./components/employ/pages/BankAccountlist";
import TransactionChart from "./components/user/pages/TransactionChart";
import Bankanalytics from "./components/admin/pages/BankAccountanalytics";
import Adminchart from "./components/admin/pages/AdminTransactionschart";
import VisitoerList from "./components/admin/pages/VisitoerList";
function App() {
  const [selectedSection, setSelectedSection] = useState("withdrawal");
  const [employerSection, setEmployerSection] = useState("Employer-List");
  const [adminSection, setAdminSection] = useState("User-List");

  const renderuserContent = () => {
    switch (selectedSection) {
      case "BankToBankTransfer":
        return <BankToBankTransfer />;
      case "withdrawal":
        return <Withdrawal />;
      case "Deposit":
        return <Deposit />;
      case "balance":  
        return <Balance />;
      case "transactions":
        return <Transactions />;
      case "Changepin":
        return <Changepin />;
      case "TransactionChart":
        return <TransactionChart />;
      default:
        return <Withdrawal />;
    }
  };


  const renderadminContent = () => {
    switch (adminSection) {
      case 'AdminHome':
        return <AdminHome />;
      case "BankFund":
        return <BankFund />;
      case "create-admin":
        return <CreateAdmin />;
      case "AdminList":
        return <AdminList />;
      case "EmployesList":
        return <EmployesList />;
      case "EmployerCreate":
        return <EmployerCreate />;
      case "BankAccountlist":
        return <BankAccountlist />;
      case "Bankanalytics":
        return <Bankanalytics />;
      // case "VisitoerList":
      //   return <VisitoerList />;
      default:
        return <EmployesList />;
    }
  };

  const renderemployContent = () => {
    switch (employerSection) {
      case "BankAccountlist":
        return <BankAccountlist />;
      case "create-bank-account":
        return <Openaccount/>;
      case "Updateaccountdetails":
        return <Updateaccountdetails />;
      default:
        return <Openaccount />;
    }
  };


  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/employer-dashboard" element={<EmployerDashboard />} /> */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* user */}

          <Route element={<ProtectedRoute />}>
            <Route
              path="/user-dashboard"
              element={
                <div className="flex">
                  <UserDashboard onSelect={setSelectedSection} />
                  <div className="flex-1 h-screen bg-gray-100 p-4">
                    {renderuserContent()}
                  </div>
                </div>
              }
            />
            {/* <Route path="/UserHome" element={<UserHome />} /> */}
          </Route>

          {/* admin */}

          <Route element={<ProtectedRoute />}>
            <Route path="/admin-dashboard"
              element={
                <div className="flex">
                  <AdminDashboard prop={setAdminSection} />
                  <div className="flex-1 h-screen bg-gray-100 p-4">
                    {renderadminContent()}
                  </div>
                </div>
              }
            />
            <Route path="/AdminList" element={<AdminList />} />
            <Route path="/Adminchart" element={<Adminchart />} />
            <Route path="/EmployesList" element={<EmployesList />} />
          </Route>

          {/* employ */}

          <Route element={<ProtectedRoute />}>
            <Route
              path="/employer-dashboard"
              element={
                <div className="flex">
                  <EmployerDashboard employprop={setEmployerSection} />
                  <div className="flex-1 h-screen bg-gray-100">
                    {renderemployContent()}
                  </div>
                </div>
              }
            />
            <Route path="/BankAccountlist" element={<BankAccountlist />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;