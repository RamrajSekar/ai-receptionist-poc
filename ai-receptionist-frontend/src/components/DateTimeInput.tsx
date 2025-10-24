interface DateTimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function DateTimeInput({ label, value, onChange }: DateTimeInputProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-gray-700">{label}</label>
      <input
        type="datetime-local"
        className="border rounded p-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
