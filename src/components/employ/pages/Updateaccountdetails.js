import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBankAccount } from "../slices/Employerslices";
import axios from "axios";
import { fetchTransactions } from "../../user/Slice/accountSlice";

function Updateaccountdetails() {
  const [searchTerm, setSearchTerm] = useState("");
  const [accountData, setAccountData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filterDeposit, setFilterDeposit] = useState(true);
  const [filterWithdrawal, setFilterWithdrawal] = useState(true);
  const [filtertransfer, setFilterTransfer] = useState(true);
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);



  useEffect(() => {
    dispatch(fetchBankAccount());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const findAccount = () => {
    const matchedAccount = users.find((account) => {
      const query = searchTerm.toLowerCase();
      return (
        account.accountNumber.toString().includes(query) ||
        account.firstName.toLowerCase().includes(query) ||
        account.lastName.toLowerCase().includes(query) ||
        account.phoneNumber?.toString().includes(query)
      );
    });

    if (matchedAccount) {
      setAccountData(matchedAccount);
      findTransactions(matchedAccount.accountNumber);
    } else {
      setAccountData(null);
      setTransactions([]);
    }
  };

  const findTransactions = (accountNumber) => {
    axios.get("http://localhost:5000/transactions").then((res) => {
      const filteredTransactions = res.data.filter(
        (transaction) => transaction.accountNumber === accountNumber
      );
      setTransactions(filteredTransactions);
    });
  };

  const filterTransactions = (transactions) => {
    return transactions.filter((transaction) => {
      if (["Deposit", 'Deposit (B2B)'].includes(transaction.type) && !filterDeposit) return false;
      if (transaction.type === "Withdrawal" && !filterWithdrawal) return false;
      if (transaction.type === "Transfer (B2B)" && !filtertransfer) return false;

      const transactionDate = new Date(transaction.date);
      const today = new Date();

      if (dateFilter === "7days") {
        return transactionDate >= new Date(today.setDate(today.getDate() - 7));
      }
      if (dateFilter === "30days") {
        return transactionDate >= new Date(today.setDate(today.getDate() - 30));
      }
      if (dateFilter === "6months") {
        return transactionDate >= new Date(today.setMonth(today.getMonth() - 6));
      }
      if (dateFilter === "1year") {
        return transactionDate >= new Date(today.setFullYear(today.getFullYear() - 1));
      }
      if (dateFilter === "custom") {
        const fromDate = new Date(customDateFrom);
        const toDate = new Date(customDateTo);
        return transactionDate >= fromDate && transactionDate <= toDate;
      }

      return true;
    });
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Search Account Transactions</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by account number, name, or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-4 py-2"
        />
        <button
          onClick={findAccount}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          {accountData ? (
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Account Details</h3>
              <p>Account Number: {accountData.accountNumber}</p>
              <p>
                Account Holder: {accountData.firstName} {accountData.lastName}
              </p>
              <p>Phone Number: {accountData.phoneNumber}</p>
              <p>Balance: {accountData.initialDeposit}</p>
            </div>
          ) : searchTerm ? (
            <p>No matching account found.</p>
          ) : (
            <p>Enter an account number to search.</p>
          )}
        </div>

        {accountData && (
          <div className="mb-4 flex items-center space-x-4">
            <label>
              <input
                type="checkbox"
                checked={filterDeposit}
                onChange={() => setFilterDeposit(!filterDeposit)}
                className="mr-1"
              />
              Deposit
            </label>
            <label>
              <input
                type="checkbox"
                checked={filterWithdrawal}
                onChange={() => setFilterWithdrawal(!filterWithdrawal)}
                className="mr-1"
              />
              Withdrawal
            </label>
            <label>
              <input
                type="checkbox"
                checked={filtertransfer}
                onChange={() => setFilterTransfer(!filtertransfer)}
                className="mr-1"
              />
              Transfer(B2B)
            </label>
          </div>
        )}

        {accountData && (
          <div className="mb-4">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-50 border border-gray-300 px-4 py-2"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateFilter === "custom" && (
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={customDateFrom}
                  onChange={(e) => setCustomDateFrom(e.target.value)}
                  className="border border-gray-300 px-4 py-2"
                />
                <input
                  type="date"
                  value={customDateTo}
                  onChange={(e) => setCustomDateTo(e.target.value)}
                  className="border border-gray-300 px-4 py-2"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {accountData && transactions.length > 0 ? (
        <div className="relative top-[-5px] overflow-auto max-h-[400px]">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="sticky top-0 bg-white shadow">
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600">
                  Transaction Id
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600">
                  Date
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600">
                  Time
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600">
                  Transaction Type
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600">
                  Amount
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600">
                  Account Number
                </th>
              </tr>
            </thead>
            <tbody>
              {filterTransactions(transactions).map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 border-b border-gray-300">{transaction.id}</td>
                  <td className="px-6 py-4 border-b border-gray-300">{transaction.date}</td>
                  <td className="px-6 py-4 border-b border-gray-300">{transaction.time}</td>
                  <td
                    className={`px-6 py-4 border-b border-gray-300 ${transaction.type === "Withdrawal"
                      ? "text-red-500"
                      : transaction.type === "Deposit"
                        ? "text-green-500"
                        : transaction.type === "Deposit (B2B)"
                          ? "text-green-500"
                          : "text-blue-500"
                      }`}
                  >
                    {transaction.type}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-300">{transaction.amount}</td>
                  <td className="px-6 py-4 border-b border-gray-300">*********{transaction.accountNumber.slice(-4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        accountData && <p>No transactions found for this account.</p>
      )}
    </div>
  );
}

export default Updateaccountdetails;
