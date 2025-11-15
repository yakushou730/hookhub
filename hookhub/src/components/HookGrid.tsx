import { HookCard } from './HookCard';
import type { Hook } from '@/types/hook';

interface HookGridProps {
  hooks: Hook[];
  onHookClick: (hook: Hook) => void;
}

export const HookGrid = ({ hooks, onHookClick }: HookGridProps) => {
  if (hooks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No hooks found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {hooks.map(hook => (
        <HookCard key={hook.id} hook={hook} onClick={() => onHookClick(hook)} />
      ))}
    </div>
  );
};
