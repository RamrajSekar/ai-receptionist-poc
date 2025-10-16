export default function Header({ title, actionLabel, onAction }: any) {
  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {actionLabel && (
        <button
          onClick={onAction}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          {actionLabel}
        </button>
      )}
    </header>
  );
}
