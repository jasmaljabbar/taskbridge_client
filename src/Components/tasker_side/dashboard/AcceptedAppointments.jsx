import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../../../redux/actions/authService";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { PaginatedTable } from "../../admin_side/PaginatedSubscriptionTable ";

const AcceptedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [chartData, setChartData] = useState({});
  const [view, setView] = useState("daily");
  const accessToken = useSelector((state) => state.auth.token);
  const chartRef = useRef(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BASE_URL}dashboard/accepted-appointments/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAppointments(response.data);
      console.log("================nnnnnnnnn===================");
      console.log(response.data);
      console.log("====================================");
      setChartData({
        daily: formatChartData(response.data.daily),
        monthly: formatChartData(response.data.monthly),
        yearly: formatChartData(response.data.yearly),
      });
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to fetch appointments. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const formatChartData = (data) => ({
    labels: data.map(
      (item) => item.date || item.day || item.month || item.year
    ),
    datasets: [
      {
        label: "Minimum Hours to Work",
        data: data.map((item) => item.total_hours),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Minimum Hours to Work per Appointment",
      },
    },
  };

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen w-[92%] p-4 sm:p-6 lg:ms-60">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Accepted Appointments
      </h1>

      {appointments && (
        <div className="bg-white w-full shadow-md rounded p-4 mb-6">
          <h2 className="text-xl font-bold mb-4">Progress Graph</h2>
          <div className="flex justify-center mb-4">
            <select
              value={view}
              onChange={handleViewChange}
              className="p-2 rounded"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="w-full h-64 sm:h-96">
            <Bar data={chartData[view]} options={chartOptions} ref={chartRef} />
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded p-4 w-full">
        {appointments ? (
          <div className="overflow-hidden">
            <PaginatedTable
              data={appointments[view]}
              headers={["User", "Min Hours", "Date"]}
              dataFields={["user_name", "total_hours", "day"]}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              className="w-full table-auto"
            />
          </div>
        ) : (
          <div>No accepted appointments found.</div>
        )}
      </div>
    </div>
  );
};

export default AcceptedAppointments;
