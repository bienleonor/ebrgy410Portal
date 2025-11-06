export default function SelectInput({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  required = false,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  labelClassName = "",
  containerClassName = ""
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className={labelClassName || "block mb-1 font-medium"}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={className || "w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"}
      >
        {placeholder && <option value="" disabled={disabled}>{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}