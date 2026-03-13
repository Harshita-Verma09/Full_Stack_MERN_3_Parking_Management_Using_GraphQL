import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import Booking from "./Booking";
import MyBookingId from "./MyBookingId";
import ScanBookings from "./ScanBooking";
import Help from "./Help";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function Dashboard() {
  const userEmail = localStorage.getItem("email");

  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("analytics");

  const fetchStats = () => {
    fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        query: `
          query {
            dashboardStats {
              totalSlots
              occupiedSlots
              totalBookings
              totalCars
              totalBikes
            }
            bookingAnalytics {
              date
              count
            }
          }
        `
      })
    })
      .then(res => res.json())
      .then(data => {
        setStats({
          ...data.data.dashboardStats,
          analytics: data.data.bookingAnalytics
        });
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return <div className="dashboard-page">Loading...</div>;

  const availableSlots = stats.totalSlots - stats.occupiedSlots;

  const barData = [
    { name: "Cars", value: stats.totalCars },
    { name: "Bikes", value: stats.totalBikes }
  ];

  const pieData = [
    { name: "Occupied", value: stats.occupiedSlots },
    { name: "Available", value: availableSlots }
  ];

  return (
    <div className="dashboard-page">

      <h1 className="dashboard-heading">
        Parking Analytics Dashboard
      </h1>

      {/* Tabs */}
      <div className="tabs">

        <button
          className={activeTab === "analytics" ? "active" : ""}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>

        <button
          className={activeTab === "booking" ? "active" : ""}
          onClick={() => setActiveTab("booking")}
        >
          Booking
        </button>

        <button
          className={activeTab === "myBookingId" ? "active" : ""}
          onClick={() => setActiveTab("myBookingId")}
        >
          My Booking ID
        </button>

        <button
          className={activeTab === "help" ? "active" : ""}
          onClick={() => setActiveTab("help")}
        >
          Help
        </button>

        <button
          className={activeTab === "scan" ? "active" : ""}
          onClick={() => setActiveTab("scan")}
        >
          Scan QR
        </button>

      </div>

      {/* ANALYTICS TAB */}
      {activeTab === "analytics" && (
        <>

          <div className="cards">

            <div className="card">
              <h3>Total Slots</h3>
              <p>{stats.totalSlots}</p>
            </div>

            <div className="card">
              <h3>Occupied</h3>
              <p>{stats.occupiedSlots}</p>
            </div>

            <div className="card">
              <h3>Available</h3>
              <p>{availableSlots}</p>
            </div>

            <div className="card">
              <h3>Total Bookings</h3>
              <p>{stats.totalBookings}</p>
            </div>

            <div className="card">
              <h3>Total Vehicles</h3>
              <p>{stats.totalCars + stats.totalBikes}</p>
            </div>

          </div>

          {/* Charts */}
          <div className="charts-grid">

            <div className="chart-container">
              <h2>Daily Booking Trend</h2>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.analytics}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366F1"
                    strokeWidth={4}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h2>Vehicle Distribution</h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    <Cell fill="#06B6D4" />
                    <Cell fill="#8B5CF6" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h2>Slot Usage Ratio</h2>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                  >
                    <Cell fill="#6366F1" />
                    <Cell fill="#06B6D4" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>

        </>
      )}

      {/* BOOKING TAB */}
      {activeTab === "booking" && (
        <Booking refreshDashboard={fetchStats} />
      )}

      {/* MY BOOKING TAB */}
      {activeTab === "myBookingId" && (
        <MyBookingId />
      )}

      {/* HELP TAB */}

      {activeTab === "help" && (
        <Help />
      )}


      {/* SCAN QR TAB */}

      {/* {activeTab === "scan" && userEmail && (
        <ScanBookings email={userEmail} />
      )} */}

      {activeTab === "scan" && userEmail && (
        <ScanBookings />
      )}

    </div>
  );
}


