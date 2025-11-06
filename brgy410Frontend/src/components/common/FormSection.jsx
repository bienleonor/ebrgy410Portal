export default function FormSection({ 
  title, 
  children, 
  columns = 2 
}) {
  const gridCols = columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2";
  
  return (
    <div className="space-y-2">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className={`bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid ${gridCols} gap-4`}>
        {children}
      </div>
    </div>
  );
}