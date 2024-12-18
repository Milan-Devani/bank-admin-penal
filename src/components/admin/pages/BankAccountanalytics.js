import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchBankAccount } from '../../employ/slices/Employerslices';

const BankAccountanalytics = () => {
    const dispatch = useDispatch();
    const { users: data, status } = useSelector((state) => state.bankAccount);
    const [filter, setFilter] = useState('All Time');
    const [customRange, setCustomRange] = useState({ start: '', end: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const result = await dispatch(fetchBankAccount());
                if (result.error) {
                    setError('Failed to fetch account data');
                } else {
                    setError(null);
                }
            } catch (err) {
                setError('Failed to fetch account data');
            } finally {
                setLoading(false); 
            }
        };
    
        if (status === 'idle') {
            loadData();
        } else if (status === 'succeeded') {
            setLoading(false);
        }
    }, [dispatch, status]);
    

    useEffect(() => {
        console.log('Data from Redux:', data);
        console.log('Status from Redux:', status);
    }, [data, status]);

    const filterAccounts = useMemo(() => {
        const now = new Date();
        const calculateDateDifference = (date) => {
            const accountOpenDate = new Date(date);
            const timeDiff = now - accountOpenDate;
            return timeDiff / (1000 * 3600 * 24);
        };

        switch (filter) {
            case 'Last 7 Days':
                return data.filter((account) => calculateDateDifference(account.accountopendate) <= 7);
            case 'Last 15 Days':
                return data.filter((account) => calculateDateDifference(account.accountopendate) <= 15);
            case 'Last 30 Days':
                return data.filter((account) => calculateDateDifference(account.accountopendate) <= 30);
            case 'Last 3 Months':
                return data.filter((account) => calculateDateDifference(account.accountopendate) <= 90);
            case 'Last 6 Months':
                return data.filter((account) => calculateDateDifference(account.accountopendate) <= 180);
            case '1 Year':
                return data.filter((account) => calculateDateDifference(account.accountopendate) <= 365);
            case 'Custom Days':
                const { start, end } = customRange;
                return data.filter((account) => {
                    const accountDate = new Date(account.accountopendate);
                    return accountDate >= new Date(start) && accountDate <= new Date(end);
                });
            default:
                return data;
        }
    }, [data, filter, customRange]);

    const monthlyData = useMemo(() => {
        const monthlyData = {};
        filterAccounts.forEach((account) => {
            const date = new Date(account.accountopendate);
            const month = date.toLocaleString('default', { month: 'short' });

            if (!monthlyData[month]) {
                monthlyData[month] = { BankAccount: 0 };
            }

            monthlyData[month].BankAccount += 1;
        });

        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        allMonths.forEach((month) => {
            if (!monthlyData[month]) {
                monthlyData[month] = { BankAccount: 0 };
            }
        });

        return allMonths.map((month) => ({
            name: month,
            BankAccount: monthlyData[month].BankAccount,
        }));
    }, [filterAccounts]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className='flex items-center mb-4 w-[700px]'>
                <div className='flex'>
                    <div><label className='text-[22px] ml-[50px]' htmlFor="timeFilter">{`Bank Account Graph Analysis Time Range :  `}</label></div>
                    <select
                        id="timeFilter"
                        value={filter}
                        className='border border-gray-300 px-4 py-2 mb-2 ml-[10px]'
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
            </div>

            <div style={{ width: 700, height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="BankAccount" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BankAccountanalytics;
