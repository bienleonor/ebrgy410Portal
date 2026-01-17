import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import toast from "react-hot-toast";
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Users, UserCheck, Accessibility, Award, FileText, TrendingUp, Download } from 'lucide-react';

const COLORS = ['#4C8BF5', '#E85D8C', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

export default function AdminStatistics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    genderDistribution: [],
    ageBrackets: [],
    seniorCitizenCount: 0,
    pwdCount: 0,
    certificatePurposes: [],
    certificateTypes: [],
    certificateStatus: [],
    votersList: [],
  });

  const [activeTab, setActiveTab] = useState('demographics'); // demographics, certificates, voters

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/statistics");
        setStats(res.data);
      } catch (error) {
        console.error("Statistics error:", error);
        toast.error("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Export to CSV function
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Convert data to CSV
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${filename} successfully!`);
  };

  // Export Demographics
  const exportDemographics = () => {
    const demographicsData = [
      { category: 'Senior Citizens', count: stats.seniorCitizenCount },
      { category: 'PWD', count: stats.pwdCount },
      { category: 'Registered Voters', count: stats.votersList.length },
      ...stats.genderDistribution.map(g => ({ category: `Gender - ${g.gender}`, count: g.count })),
      ...stats.ageBrackets.map(a => ({ category: `Age ${a.age_bracket}`, count: a.count })),
    ];
    exportToCSV(demographicsData, 'demographics_statistics');
  };

  // Export Certificates
  const exportCertificates = () => {
    const certificatesData = [
      ...stats.certificateTypes.map(c => ({ 
        type: 'Certificate Type', 
        name: c.certificate_type, 
        count: c.count 
      })),
      ...stats.certificateStatus.map(s => ({ 
        type: 'Status', 
        name: s.status, 
        count: s.count 
      })),
      ...stats.certificatePurposes.map(p => ({ 
        type: 'Purpose', 
        name: p.purpose, 
        count: p.count 
      })),
    ];
    exportToCSV(certificatesData, 'certificates_statistics');
  };

  // Export Voters
  const exportVoters = () => {
    exportToCSV(stats.votersList, 'voters_list');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 to-pink-500 p-6 flex items-center justify-center">
        <div className="text-white text-2xl">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 to-pink-500 p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-wide mb-2">STATISTICS & ANALYTICS</h1>
          <p className="text-white/90">Comprehensive data insights and reports</p>
        </div>
        
        {/* Export Button */}
        <button
          onClick={() => {
            if (activeTab === 'demographics') exportDemographics();
            else if (activeTab === 'certificates') exportCertificates();
            else if (activeTab === 'voters') exportVoters();
          }}
          className="flex items-center gap-2 px-6 py-3 bg-white text-pink-600 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
        >
          <Download size={20} />
          Export {activeTab === 'demographics' ? 'Demographics' : activeTab === 'certificates' ? 'Certificates' : 'Voters'}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <TabButton 
          active={activeTab === 'demographics'} 
          onClick={() => setActiveTab('demographics')}
          icon={<Users size={20} />}
        >
          Demographics
        </TabButton>
        <TabButton 
          active={activeTab === 'certificates'} 
          onClick={() => setActiveTab('certificates')}
          icon={<FileText size={20} />}
        >
          Certificates
        </TabButton>
        <TabButton 
          active={activeTab === 'voters'} 
          onClick={() => setActiveTab('voters')}
          icon={<UserCheck size={20} />}
        >
          Voters
        </TabButton>
      </div>

      {/* Demographics Tab */}
      {activeTab === 'demographics' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Senior Citizens" 
              value={stats.seniorCitizenCount} 
              icon={<Users className="text-blue-500" size={32} />}
              color="bg-blue-50"
            />
            <StatCard 
              title="PWD" 
              value={stats.pwdCount} 
              icon={<Accessibility className="text-green-500" size={32} />}
              color="bg-green-50"
            />
            <StatCard 
              title="Registered Voters" 
              value={stats.votersList.length} 
              icon={<UserCheck className="text-purple-500" size={32} />}
              color="bg-purple-50"
            />
            <StatCard 
              title="Total Residents" 
              value={stats.genderDistribution.reduce((sum, g) => sum + g.count, 0)} 
              icon={<TrendingUp className="text-orange-500" size={32} />}
              color="bg-orange-50"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gender Distribution */}
            <ChartCard title="Gender Distribution">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.genderDistribution}
                    dataKey="count"
                    nameKey="gender"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {stats.genderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Age Brackets */}
            <ChartCard title="Age Distribution">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.ageBrackets}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age_bracket" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#4C8BF5" name="Residents" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Certificate Types */}
            <ChartCard title="Certificate Types Distribution">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.certificateTypes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="certificate_type" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#E85D8C" name="Requests" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Certificate Status */}
            <ChartCard title="Certificate Request Status">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.certificateStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {stats.certificateStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Top Purposes */}
          <ChartCard title="Top Certificate Purposes">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={stats.certificatePurposes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="purpose" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="count" fill="#98D8C8" name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* Voters Tab */}
      {activeTab === 'voters' && (
        <div className="space-y-6">
          <ChartCard title={`Registered Voters List (${stats.votersList.length} total)`}>
            <div className="overflow-x-auto max-h-[600px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Voter Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.votersList.map((voter, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {voter.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voter.voter_num || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voter.sex}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voter.age}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      )}
    </div>
  );
}

// Components
function TabButton({ active, onClick, children, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
        active
          ? 'bg-white text-pink-600 shadow-lg'
          : 'bg-white/20 text-white hover:bg-white/30'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`${color} rounded-2xl shadow-md p-6 flex items-center gap-4`}>
      <div>{icon}</div>
      <div>
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        <div className="text-sm font-medium text-gray-600">{title}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}
