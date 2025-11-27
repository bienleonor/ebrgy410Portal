import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  // Dashboard stats
  const [stats, setStats] = useState({
    households: 0,
    residents: 0,
    voters: 0,
    certificates: 0,
  });

  const COLORS = ['#4C8BF5', '#E85D8C'];

  // Fetch all counts
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/stats");

        // Expect: { households: 0, residents: 0, voters: 0, certificates: 0 }
        setStats(res.data);

      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 to-pink-500 p-6 text-gray-800">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white tracking-wide">ADMIN DASHBOARD</h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card title="HOUSEHOLDS" value={stats.households} icon="🏠" loading={loading} />
        <Card title="RESIDENTS" value={stats.residents} icon="👥" loading={loading} />
        <Card title="REGISTERED VOTERS" value={stats.voters} icon="📝" loading={loading} />
        <Card title="CERTIFICATES" value={stats.certificates} icon="📄" loading={loading} />
      </div>

    </div>
  );
}

function Card({ title, value, icon, loading }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center">
      <div className="text-3xl mb-2">{icon}</div>

      {loading ? (
        <div className="h-6 w-16 bg-gray-300 animate-pulse rounded-md"></div>
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}

      <div className="text-sm font-medium">{title}</div>
    </div>
  );
}
