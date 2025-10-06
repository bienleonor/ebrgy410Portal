export default function PrimaryButton({ text, type = "submit", onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="border bg-base-200-dim border-base-200 hover:text-secondary hover:bg-base-200 hover:border-base-200-dim text-white font-semibold py-2 px-4 rounded w-full transition duration-200"
    >
      {text}
    </button>
  );
}
