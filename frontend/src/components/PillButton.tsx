interface PillButtonProps {
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

export function PillButton({ label, onClick, isActive = false }: PillButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-gray-100'
      }`}
    >
      {label}
    </button>
  );
}
