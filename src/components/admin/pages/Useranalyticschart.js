import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getdata } from '../slices/adminSlice';

const Useranalyticschart = () => {
    const dispatch = useDispatch();

    const { dataList, status } = useSelector((state) => state.admin);
    
    const [filter, setFilter] = useState('All Time');
    const [customRange, setCustomRange] = useState({ start: '', end: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const users = dataList.filter((item) => item.role === "user");
    console.log("user", users);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const result = await dispatch(getdata());
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
        console.log('Data from Redux:', dataList);
        console.log('Status from Redux:', status);
    }, [dataList, status]);

    const filterAccounts = useMemo(() => {
        const now = new Date();
        const calculateDateDifference = (dataList) => {
            const currentdate = new Date(dataList);
            const timeDiff = now - currentdate;
            return timeDiff / (1000 * 3600 * 24);
        };

        switch (filter) {
            case 'Last 7 Days':
                return dataList.filter((users) => calculateDateDifference(users.currentdate) <= 7);
            case 'Last 15 Days':
                return dataList.filter((users) => calculateDateDifference(users.currentdate) <= 15);
            case 'Last 30 Days':
                return dataList.filter((users) => calculateDateDifference(users.currentdate) <= 30);
            case 'Last 3 Months':
                return dataList.filter((users) => calculateDateDifference(users.currentdate) <= 90);
            case 'Last 6 Months':
                return dataList.filter((users) => calculateDateDifference(users.currentdate) <= 180);
            case '1 Year':
                return dataList.filter((users) => calculateDateDifference(users.currentdate) <= 365);
            case 'Custom Days':
                const { start, end } = customRange;
                return dataList.filter((user) => {
                    const currentDate = new Date(user.currentdate);
                    return currentDate >= new Date(start) && currentDate <= new Date(end);
                });
            default:
                return dataList;
        }
    }, [dataList, filter, customRange]);

    const monthlyData = useMemo(() => {
        const monthlyData = {};
        filterAccounts.forEach((account) => {
            const date = new Date(account.currentdate);
            const month = date.toLocaleString('default', { month: 'short' });

            if (!monthlyData[month]) {
                monthlyData[month] = { visiter: 0 };
            }

            monthlyData[month].visiter += 1;
        });

        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        allMonths.forEach((month) => {
            if (!monthlyData[month]) {
                monthlyData[month] = { visiter: 0 };
            }
        });

        return allMonths.map((month) => ({
            name: month,
            visiter: monthlyData[month].visiter,
        }));
    }, [filterAccounts]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className='flex items-center mb-4 w-[700px]'>
                <div className='flex'>
                    <div><label className='text-[22px] ml-[50px]' htmlFor="timeFilter">{`visiter Graph Analysis Time Range :  `}</label></div>
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
                        <Line type="monotone" dataKey="visiter" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Useranalyticschart;