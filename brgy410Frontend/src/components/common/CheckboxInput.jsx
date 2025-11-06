export default function CheckboxInput({ 
  id, 
  name, 
  checked, 
  onChange, 
  label 
}) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-green-300"
      />
      <label htmlFor={id} className="text-sm font-medium cursor-pointer">
        {label}
      </label>
    </div>
  );
}