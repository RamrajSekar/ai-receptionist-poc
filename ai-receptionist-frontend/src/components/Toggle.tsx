interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function Toggle({ label, value, onChange }: ToggleProps) {
  return (
    <label className="flex items-center space-x-4 cursor-pointer select-none">
      <span>{label}</span>
      <div className={`relative w-12 h-6`}>
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="absolute w-0 h-0 opacity-0"
        />
        <span
          className={`block w-full h-full rounded-full transition-colors ${
            value ? "bg-[#003D4D]" : "bg-gray-300"
          }`}
        ></span>
        <span
          className={`absolute top-0 left-0 w-6 h-6 bg-white rounded-full transform transition-transform ${
            value ? "translate-x-6" : "translate-x-0"
          }`}
        ></span>
      </div>
    </label>
  );
}
