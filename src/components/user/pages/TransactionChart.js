import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchTransactions } from "../Slice/accountSlice";

const TransactionChart = () => {
  const dispatch = useDispatch();
  const { accountData, transactions } = useSelector((state) => state.account);
  const [filter, setFilter] = useState('All Time');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [filterDeposit, setFilterDeposit] = useState(true);
  const [filterspend, setFilterSpend] = useState(true);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const filterTransactions = (transactions, filter) => {
    const now = new Date();
    const calculateDateDifference = (date) => {
      const transactionDate = new Date(date);
      const timeDiff = now - transactionDate;
      return timeDiff / (1000 * 3600 * 24);
    };

    switch (filter) {
      case 'Last 7 Days':
        return transactions.filter((transaction) => calculateDateDifference(transaction.date) <= 7);
      case 'Last 15 Days':
        return transactions.filter((transaction) => calculateDateDifference(transaction.date) <= 15);
      case 'Last 30 Days':
        return transactions.filter((transaction) => calculateDateDifference(transaction.date) <= 30);
      case 'Last 3 Months':
        return transactions.filter((transaction) => calculateDateDifference(transaction.date) <= 90);
      case 'Last 6 Months':
        return transactions.filter((transaction) => calculateDateDifference(transaction.date) <= 180);
      case '1 Year':
        return transactions.filter((transaction) => calculateDateDifference(transaction.date) <= 365);
      case 'Custom Days':
        const { start, end } = customRange;
        return transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= new Date(start) && transactionDate <= new Date(end);
        });
      default:
        return transactions;
    }
  };

  const filteredTransactions = filterTransactions(
    transactions.filter((transaction) =>
      transaction.accountNumber === accountData.accountNumber &&
      ((transaction.type === 'Deposit' && filterDeposit) ||
        (transaction.type === 'Withdrawal' && filterspend) ||
        (transaction.senderaccountNumber === accountData.accountNumber && filterspend) ||
        (transaction.receiveraccountNumber === accountData.accountNumber && filterDeposit))
    ),
    filter
  );

  const monthlyData = {};
  filteredTransactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const month = date.toLocaleString('default', { month: 'short' });

    if (!monthlyData[month]) {
      monthlyData[month] = { Spend: 0, Deposit: 0 };
    }

    const amount = parseFloat(transaction.amount.replace('₹', '').replace(',', ''));

    if (transaction.type === 'Withdrawal' || transaction.senderaccountNumber === accountData.accountNumber) {
      monthlyData[month].Spend += amount;
    } else if (transaction.type === 'Deposit' || transaction.receiveraccountNumber === accountData.accountNumber) {
      monthlyData[month].Deposit += amount;
    }
  });

  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  allMonths.forEach((month) => {
    if (!monthlyData[month]) {
      monthlyData[month] = { Spend: 0, Deposit: 0 };
    }
  });

  const pData = allMonths.map((month) => ({
    name: month,
    Spend: monthlyData[month].Spend,
    Deposit: monthlyData[month].Deposit,
  }));

  return (
    <div>
      <div className='flex items-center'>
        <div style={{ marginBottom: '20px' }}>
          <label className='text-[22px]' htmlFor="timeFilter">{`Select Time Range : ${""}`}</label>
          <select
            id="timeFilter"
            value={filter}
            className='border border-gray-300 px-4 py-2 mb-[10px]'
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All Time">All Time</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 15 Days">Last 15 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="1 Year">1 Year</option>
            <option value="Custom Days">Custom Days</option>
          </select>

          {filter === 'Custom Days' && (
            <div style={{ marginBottom: '20px' }}>
              <input
                type="date"
                value={customRange.start}
                onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                placeholder="Start Date"
                className='border border-gray-300 px-4 py-2 mr-[10px]'
              />
              <input
                type="date"
                value={customRange.end}
                onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                placeholder="End Date"
                className='border border-gray-300 px-4 py-2'
              />
            </div>
          )}
        </div>



        <div className="flex items-center ml-[10px] space-x-2">
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
              checked={filterspend}
              onChange={() => setFilterSpend(!filterspend)}
              className="mr-1"
            />
            Spend
          </label>
        </div>
      </div>

      <div style={{ width: '100%', height: 500 }}>
        <ResponsiveContainer>
          <LineChart
            width={500}
            height={300}
            data={pData}
            margin={{ top: 100, right: 200, left: 150, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Spend" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Deposit" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionChart;
