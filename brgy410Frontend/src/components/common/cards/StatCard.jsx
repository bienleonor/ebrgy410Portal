export default function StatCard({ icon, count, label, variant = 'default' }) {
  const variants = {
    rejected: 'bg-red-50 border-red-200',
    total: 'bg-blue-50 border-blue-200',
    approved: 'bg-green-50 border-green-200',
    pending: 'bg-yellow-50 border-yellow-200',
    default: 'bg-gray-50 border-gray-200'
  };

  return (
    <div className={`${variants[variant]} border rounded-lg p-6 text-center hover:shadow-md transition-shadow`}>
      <div className="flex justify-center mb-3">
        {icon}
      </div>
      <div className="text-3xl font-bold mb-2">{count}</div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </div>
  );
}