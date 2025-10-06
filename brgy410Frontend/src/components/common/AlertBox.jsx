export default function AlertBox({ message, type = "success" }) {
  if (!message) return null;
  const colors = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div className={`${colors} text-white p-3 rounded mb-4 text-sm font-semibold`}>
      {message}
    </div>
  );
}
