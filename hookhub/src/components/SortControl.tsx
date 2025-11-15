interface SortControlProps {
  value: 'stars' | 'updated' | 'name-asc' | 'name-desc';
  onChange: (value: 'stars' | 'updated' | 'name-asc' | 'name-desc') => void;
}

export const SortControl = ({ value, onChange }: SortControlProps) => {
  const handleChange = (newValue: string) => {
    onChange(newValue as 'stars' | 'updated' | 'name-asc' | 'name-desc');
  };

  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm font-medium">Sort by:</span>
      <select
        value={value}
        onChange={e => handleChange(e.target.value)}
        className="px-3 py-1 border rounded text-sm"
      >
        <option value="stars">Most Stars</option>
        <option value="updated">Recently Updated</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
      </select>
    </div>
  );
};
