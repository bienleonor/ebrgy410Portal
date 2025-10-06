export default function TextInput({ label, name, type = "text", value, onChange, placeholder }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1 ">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-base-200-dim rounded px-3 py-2 text-info-content focus:outline-none focus:ring focus:ring-green-300"
      />
    </div>
  );
}
