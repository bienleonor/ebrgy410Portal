export default function PrimaryButton({ 
  text, 
  type = "submit", 
  onClick,
  disabled = false,
  className = ""
}) {
  const defaultClasses = "border bg-base-200-dim border-base-200 hover:text-secondary hover:bg-base-200 hover:border-base-200-dim text-white font-semibold py-2 px-4 rounded w-full transition duration-200";
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${defaultClasses} ${disabledClasses} ${className}`}
    >
      {text}
    </button>
  );
}