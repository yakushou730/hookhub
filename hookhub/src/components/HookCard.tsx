import { StarIcon, CodeBracketIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import type { Hook } from '@/types/hook';

interface HookCardProps {
  hook: Hook;
  onClick: () => void;
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Security: 'bg-red-100 text-red-700',
    Quality: 'bg-green-100 text-green-700',
    Automation: 'bg-purple-100 text-purple-700',
    Monitoring: 'bg-blue-100 text-blue-700',
    Context: 'bg-yellow-100 text-yellow-700',
    TDD: 'bg-indigo-100 text-indigo-700',
    Documentation: 'bg-pink-100 text-pink-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
};

export const HookCard = ({ hook, onClick }: HookCardProps) => {
  return (
    <div
      onClick={onClick}
      className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{hook.name}</h3>
        {hook.canBlock && (
          <ShieldCheckIcon className="w-5 h-5 text-amber-500" title="Can block operations" />
        )}
      </div>

      {/* Badges */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(hook.category)}`}>
          {hook.category}
        </span>
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
          {hook.eventType}
        </span>
        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
          {hook.language}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hook.description}</p>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <StarIcon className="w-4 h-4" />
          <span>{hook.repository.stars.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <CodeBracketIcon className="w-4 h-4" />
          <span>{hook.complexity}</span>
        </div>
      </div>
    </div>
  );
};
