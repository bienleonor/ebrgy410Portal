import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import toast from "react-hot-toast";

const AdminDashboard = () => {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample dummy data
  const visitorData = [
    { month: 'Jan', visitors: 100 },
    { month: 'Feb', visitors: 200 },
    { month: 'Mar', visitors: 400 },
    { month: 'Apr', visitors: 350 },
    { month: 'May', visitors: 450 },
    { month: 'Jun', visitors: 300 },
    { month: 'Jul', visitors: 420 },
    { month: 'Aug', visitors: 390 },
    { month: 'Sep', visitors: 350 },
    { month: 'Oct', visitors: 370 },
    { month: 'Nov', visitors: 300 },
    { month: 'Dec', visitors: 340 },
  ];

  const ageData = [
    { name: 'Seniors', value: 1 },
    { name: 'Adults', value: 3 },
    { name: 'Child', value: 2 },
  ];

  const genderData = [
    { name: 'Male', value: 5237 },
    { name: 'Female', value: 3437 },
  ];

  const COLORS = ['#4C8BF5', '#E85D8C'];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axiosInstance.get("/certificates");
        setRequests(res.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        toast.error("Failed to load your requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);


    // Compute counts
  const counts = {
    household: requests.length,
    certificates: requests.length,
    resident: requests.length,
    registered_voters: requests.length,
  };
  

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-pink-400 to-pink-500 p-6 text-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white tracking-wide">ADMIN DASHBOARD</h1>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card title="HOUSEHOLDS" value="4,453" icon="🏠" />
        <Card title="RESIDENTS" value="8,784" icon="👥" />
        <Card title="REGISTERED VOTERS" value="3,541" icon="📝" />
        <Card title="CERTIFICATES" value="546" icon="📄" />
        <Card title="PROGRAMS" value="15" icon="🧰" />
        <Card title="OFFICIALS" value="26" icon="👤" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor Insights */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="font-semibold mb-4">Visitor Insights (2025)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="visitors" stroke="#E85D8C" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Age Category */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="font-semibold mb-4">Age Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#E85D8C" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Category */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="font-semibold mb-4">Gender Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, icon }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center text-center">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm font-medium">{title}</div>
  </div>
);

export default AdminDashboard