import type { EventType, Language, Category } from '@/types/hook';

interface FilterPanelProps {
  eventType: EventType | null;
  language: Language | null;
  category: Category | null;
  onEventTypeChange: (value: EventType | null) => void;
  onLanguageChange: (value: Language | null) => void;
  onCategoryChange: (value: Category | null) => void;
  onClear: () => void;
}

export const FilterPanel = ({
  eventType,
  language,
  category,
  onEventTypeChange,
  onLanguageChange,
  onCategoryChange,
  onClear,
}: FilterPanelProps) => {
  const hasActiveFilters = eventType || language || category;

  const handleEventTypeChange = (value: string) => {
    onEventTypeChange(value ? (value as EventType) : null);
  };

  const handleLanguageChange = (value: string) => {
    onLanguageChange(value ? (value as Language) : null);
  };

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value ? (value as Category) : null);
  };

  return (
    <div className="flex gap-4 items-center">
      <span className="text-sm font-medium">Filters:</span>

      {/* Event Type Filter */}
      <select
        value={eventType || ''}
        onChange={e => handleEventTypeChange(e.target.value)}
        className="px-3 py-1 border rounded text-sm"
      >
        <option value="">All Events</option>
        <option value="UserPromptSubmit">UserPromptSubmit</option>
        <option value="PreToolUse">PreToolUse</option>
        <option value="PostToolUse">PostToolUse</option>
        <option value="Stop">Stop</option>
        <option value="SubagentStop">SubagentStop</option>
        <option value="SessionStart">SessionStart</option>
        <option value="Notification">Notification</option>
        <option value="PreCompact">PreCompact</option>
      </select>

      {/* Language Filter */}
      <select
        value={language || ''}
        onChange={e => handleLanguageChange(e.target.value)}
        className="px-3 py-1 border rounded text-sm"
      >
        <option value="">All Languages</option>
        <option value="Python">Python</option>
        <option value="Shell">Shell</option>
        <option value="TypeScript">TypeScript</option>
        <option value="JavaScript">JavaScript</option>
      </select>

      {/* Category Filter */}
      <select
        value={category || ''}
        onChange={e => handleCategoryChange(e.target.value)}
        className="px-3 py-1 border rounded text-sm"
      >
        <option value="">All Categories</option>
        <option value="Security">Security</option>
        <option value="Quality">Quality</option>
        <option value="Automation">Automation</option>
        <option value="Monitoring">Monitoring</option>
        <option value="Context">Context</option>
        <option value="TDD">TDD</option>
        <option value="Documentation">Documentation</option>
      </select>

      {/* Clear Button */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="text-sm text-blue-600 hover:text-blue-700 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};
