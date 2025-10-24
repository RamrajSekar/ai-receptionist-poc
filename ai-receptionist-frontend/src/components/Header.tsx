export default function Header({ title, actionLabel, onAction }: any) {
  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-[#1E2D2F]">{title}</h1>
      {actionLabel && (
        <button
          onClick={onAction}
          className="bg-[#007C8C] text-white px-4 py-2 rounded-lg shadow hover:bg-[#00A6B6] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </header>
  );
}
