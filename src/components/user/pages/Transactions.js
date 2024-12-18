import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../Slice/accountSlice";

const Transactions = () => {
  const dispatch = useDispatch();
  const { accountData, transactions, loading, error } = useSelector((state) => state.account);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");
  const [filterWithdrawal, setFilterWithdrawal] = useState(true);
  const [filterDeposit, setFilterDeposit] = useState(true);
  const [filtertransfer, setFilterTransfer] = useState(true);

  useEffect(() => { 
    dispatch(fetchTransactions());
  }, [dispatch]);

  const filterTransactions = (transactions) => {
    let filtered = transactions;

    filtered = filtered.filter(
      (transaction) =>
        accountData && transaction.accountNumber === accountData.accountNumber
    );

    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        transaction.id.toString().includes(searchTerm)
      );
    }

    const now = new Date();
    filtered = filtered.filter((transaction) => {
      
      const transactionDate = new Date(
        `${transaction.date} ${transaction.time}`
      );

      switch (dateFilter) {
        case "7days":
          return now - transactionDate <= 7 * 24 * 60 * 60 * 1000;
        case "30days":
          return now - transactionDate <= 30 * 24 * 60 * 60 * 1000;
        case "6months":
          return now - transactionDate <= 6 * 30 * 24 * 60 * 60 * 1000;
        case "1year":
          return now - transactionDate <= 365 * 24 * 60 * 60 * 1000;
        case "custom":
          const fromDate = customDateFrom ? new Date(customDateFrom) : null;
          const toDate = customDateTo ? new Date(customDateTo) : now;
          return (
            (!fromDate || transactionDate >= fromDate) &&
            (!toDate || transactionDate <= toDate)
          );
        default:
          return true;
      }
    });

    filtered = filtered.filter((transaction) => {
      if (!filterWithdrawal && transaction.type === "Withdrawal") return false;
      if (!filterDeposit && transaction.type === "Deposit") return false;
      return true;
    });

    return filtered;
  };
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Transactions</h2>

      {loading && <p>Loading transactions...</p>}
      {error && <p>Error fetching transactions: {error}</p>}

      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search by Transaction ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-[8px] border border-gray-300 px-4 py-2"
        />

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-300 px-4 py-2"
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

        <div className="flex items-center space-x-2">
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
      </div>

      <div className="shadow-2xl rounded-[10px] overflow-hidden">
      <div className="relative  top-[-1px] max-h-[540px] overflow-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="sticky top-0 bg-white shadow">
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600">
                Transaction Id
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600">
                Account Number
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
            </tr>
          </thead>
          <tbody>
            {filterTransactions(transactions).map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 border-b border-gray-300">
                  {transaction.id}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {`XXXX-XXXX-${transaction.accountNumber.slice(-4)}`}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {transaction.date}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {transaction.time}
                </td>
                <td
                  className={`px-6 py-4 border-b border-gray-300 ${
                    transaction.type === "Withdrawal"
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
                <td className="px-6 py-4 border-b border-gray-300">
                  {transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default Transactions;