import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";
import toast from "react-hot-toast";
import { BarChart3, Users, FileText, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Dashboard stats
  const [stats, setStats] = useState({
    households: 0,
    residents: 0,
    voters: 0,
    certificates: 0,
  });

  // Overview statistics
  const [overview, setOverview] = useState({
    seniorCitizens: 0,
    pwd: 0,
    genderDistribution: [],
    ageBrackets: [],
  });

  const COLORS = ['#4C8BF5', '#E85D8C'];

  // Fetch all counts
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/stats");
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

  // Fetch overview statistics
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/statistics");
        setOverview({
          seniorCitizens: res.data.seniorCitizenCount,
          pwd: res.data.pwdCount,
          genderDistribution: res.data.genderDistribution,
          ageBrackets: res.data.ageBrackets,
        });
      } catch (error) {
        console.error("Overview error:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchOverview();
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

      {/* Statistics Overview Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 size={28} className="text-pink-600" />
              Statistics Overview
            </h2>
            <p className="text-gray-600 text-sm">Quick insights and analytics</p>
          </div>
          <button
            onClick={() => navigate('/admin/statistics')}
            className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <TrendingUp size={20} />
            View Detailed Statistics
          </button>
        </div>

        {statsLoading ? (
          <div className="text-center py-8 text-gray-500">Loading statistics...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 mb-3">Key Metrics</h3>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Senior Citizens</span>
                <span className="text-xl font-bold text-blue-600">{overview.seniorCitizens}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">PWD</span>
                <span className="text-xl font-bold text-green-600">{overview.pwd}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Voters</span>
                <span className="text-xl font-bold text-purple-600">{stats.voters}</span>
              </div>
            </div>

            {/* Gender Distribution Preview */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Gender Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={overview.genderDistribution}
                    dataKey="count"
                    nameKey="gender"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label={(entry) => `${entry.gender}: ${entry.count}`}
                  >
                    {overview.genderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Age Brackets Preview */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Age Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={overview.ageBrackets}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age_bracket" style={{ fontSize: '12px' }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4C8BF5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
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
