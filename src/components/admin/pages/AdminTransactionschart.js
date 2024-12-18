import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchTransactions } from '../slices/bankFundSlice';

const AdminTransactionschart = () => {
    const dispatch = useDispatch();
    const transactions = useSelector(state => state.bankFund.transactions);
    const [filter, setFilter] = useState('All Time');
    const [customRange, setCustomRange] = useState({ start: '', end: '' });
    const [filterDeposit, setFilterDeposit] = useState(true);
    const [filterSpend, setFilterSpend] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                await dispatch(fetchTransactions());
            } catch (err) {
                setError('Failed to fetch transactions');
            } finally {
                setLoading(false);
            }
        };
        loadData();
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

    const adminTransactions = transactions.filter((transaction) => transaction.role === 'admin');
    const filteredTransactions = filterTransactions(adminTransactions, filter);
    const filteredByType = filteredTransactions.filter((transaction) =>
        (transaction.type.toLowerCase() === 'deposit' && filterDeposit) ||
        (transaction.type.toLowerCase() === 'withdraw' && filterSpend)
    );

    console.log("adminTransactions" , adminTransactions);
    

    console.log("filteredTransactions" , filteredTransactions);
    

    const monthlyData = {};
    filteredByType.forEach((transaction) => {
        const date = new Date(transaction.date);
        const month = date.toLocaleString('default', { month: 'short' });

        if (!monthlyData[month]) {
            monthlyData[month] = { Spend: 0, Deposit: 0 };
        }

        const amount = parseFloat(String(transaction.amount).replace('₹', '').replace(',', ''));
        
        if (transaction.type === 'withdraw') {
            monthlyData[month].Spend += amount;
        } else if (transaction.type === 'deposit') {
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

    console.log("pData" , pData);
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            {/* <h2 className="text-xl font-bold mb-4">Admin Transactions Overview</h2> */}
            <div className='flex items-center mb-4 w-[710px]'>
                <div className='flex'>
                    <div><label className='text-[22px]' htmlFor="timeFilter">{`Select Time Range: `}</label></div>
                    <select
                        id="timeFilter"
                        value={filter}
                        className='border border-gray-300 px-4 py-2 mb-2'
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
                        <div>
                            <input
                                type="date"
                                value={customRange.start}
                                onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                                className='border border-gray-300 px-4 py-2 mr-2'
                            />
                            <input
                                type="date"
                                value={customRange.end}
                                onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                                className='border border-gray-300 px-4 py-2'
                            />
                        </div>
                    )}
                </div>

                <div className="flex w-[232px] items-center ml-4 space-x-2">
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
                            checked={filterSpend}
                            onChange={() => setFilterSpend(!filterSpend)}
                            className="mr-1"
                        />
                        Spend
                    </label>
                </div>
            </div>

            <div style={{ width: 700, height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={pData}>
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

export default AdminTransactionschart;