import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { LineChart, Line } from 'recharts';
import { ResponsiveContainer } from 'recharts';

export const UserDistributionPieChart = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F'];
  
  if (!data || (data.regular_users === 0 && data.taskers === 0)) {
    return <div>No user distribution data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={[
            { name: 'Regular Users', value: data.regular_users },
            { name: 'Taskers', value: data.taskers },
          ]}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {[data.regular_users, data.taskers].map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const SubscriptionIncomeBarChart = ({ monthlyIncome, yearlyIncome }) => {
  const data = [
    { name: 'Monthly', income: monthlyIncome },
    { name: 'Yearly', income: yearlyIncome },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const UserGrowthLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No user growth data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="users" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};
