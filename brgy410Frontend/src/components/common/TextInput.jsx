export default function TextInput({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  placeholder,
  required = false,
  className = "",
  labelClassName = "",
  containerClassName = ""
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className={labelClassName || "block text-sm font-medium mb-1"}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full border border-base-200-dim rounded px-3 py-2 text-info-content focus:outline-none focus:ring focus:ring-green-300 ${className}`}
      />
    </div>
  );
}