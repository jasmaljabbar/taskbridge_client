import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../redux/actions/authService';
import { useSelector } from 'react-redux';
import { FaUsers, FaUserTie, FaMoneyBillWave } from 'react-icons/fa';
import { UserGrowthLineChart } from './UserDistributionPieChart ';
import { SubscriptionIncomeBarChart } from './UserDistributionPieChart ';
import { PaginatedTable } from './PaginatedSubscriptionTable ';
import { UserDistributionPieChart } from './UserDistributionPieChart ';

const Dashboard = () => {
  const [data, setData] = useState({
    users_count: 0,
    workers_count: 0,
    monthly_subscription_income: 0,
    yearly_subscription_income: 0,
    total_income: 0,
    subscriptions: [],
  });
  const [loading, setLoading] = useState(true);
  const [userDistribution, setUserDistribution] = useState({ free: 0, paid: 0 });
  const [userGrowth, setUserGrowth] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const accessToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          userWorkerCountData,
          incomeData,
          subscriptionData,
          userDistributionData,
          userGrowthData
        ] = await Promise.all([
          axios.get(`${BASE_URL}dashboard/counts/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`${BASE_URL}dashboard/subscription_income/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`${BASE_URL}dashboard/subscriptions/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`${BASE_URL}dashboard/user_distribution/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`${BASE_URL}dashboard/user_growth/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        // Format subscription data
        const formattedSubscriptions = subscriptionData.data.map(subscription => ({
          ...subscription,
          subscription_start_date: new Date(subscription.subscription_start_date).toISOString().split('T')[0]
        }));

        setData({
          ...userWorkerCountData.data,
          monthly_subscription_income: incomeData.data.monthly_subscription_income,
          yearly_subscription_income: incomeData.data.yearly_subscription_income,
          total_income: parseFloat(incomeData.data.monthly_subscription_income) + parseFloat(incomeData.data.yearly_subscription_income),
          subscriptions: formattedSubscriptions,
        });

        setUserDistribution(userDistributionData.data);
        setUserGrowth(userGrowthData.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data', error);
        setError('Error fetching dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get(`${BASE_URL}dashboard/download_report/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sales_report.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading report', error);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen w-full ms-60 p-6 mt-10">
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <DashboardCard title="Total Users" value={data.users_count} icon={<FaUsers />} />
          <DashboardCard title="Total Workers" value={data.workers_count} icon={<FaUserTie />} />
          <DashboardCard title="Total Income" value={`₹${(data.total_income || 0).toFixed(2)}`} icon={<FaMoneyBillWave />} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">User Distribution</h2>
            <UserDistributionPieChart data={userDistribution} />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Subscription Income</h2>
            <SubscriptionIncomeBarChart
              monthlyIncome={data.monthly_subscription_income}
              yearlyIncome={data.yearly_subscription_income}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Growth</h2>
          <UserGrowthLineChart data={userGrowth} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Subscriptions</h2>
            <button
              onClick={handleDownloadReport}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 md:mt-0"
            >
              Download Sales Report
            </button>
          </div>
          <PaginatedTable
            data={data.subscriptions}
            headers={['Full Name', 'Subscription Start Date', 'Subscription Type', 'Subscription Price']}
            dataFields={['full_name', 'subscription_start_date', 'subscription_type', 'subscription_price']}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={handleItemsPerPageChange}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon }) => (
  <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
    <div className="mr-4 text-3xl text-blue-500">{icon}</div>
    <div>
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  </div>
);

export default Dashboard;
