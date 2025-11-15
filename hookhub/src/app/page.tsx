'use client';

import { useState, useMemo } from 'react';
import hooksData from '@/data/hooks.json';
import { HookGrid } from '@/components/HookGrid';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel } from '@/components/FilterPanel';
import { SortControl } from '@/components/SortControl';
import { HookDetailModal } from '@/components/HookDetailModal';
import type { Hook, EventType, Language, Category } from '@/types/hook';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType | null>(null);
  const [languageFilter, setLanguageFilter] = useState<Language | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
  const [sortBy, setSortBy] = useState<'stars' | 'updated' | 'name-asc' | 'name-desc'>('stars');
  const [selectedHook, setSelectedHook] = useState<Hook | null>(null);

  const filteredAndSortedHooks = useMemo(() => {
    let result = hooksData.hooks as Hook[];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        hook =>
          hook.name.toLowerCase().includes(query) ||
          hook.description.toLowerCase().includes(query)
      );
    }

    if (eventTypeFilter) {
      result = result.filter(hook => hook.eventType === eventTypeFilter);
    }
    if (languageFilter) {
      result = result.filter(hook => hook.language === languageFilter);
    }
    if (categoryFilter) {
      result = result.filter(hook => hook.category === categoryFilter);
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.repository.stars - a.repository.stars;
        case 'updated':
          return new Date(b.repository.lastUpdated).getTime() -
                 new Date(a.repository.lastUpdated).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, eventTypeFilter, languageFilter, categoryFilter, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setEventTypeFilter(null);
    setLanguageFilter(null);
    setCategoryFilter(null);
  };

  return (
    <main className="min-h-screen p-8">
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-2">HookHub</h1>
        <p className="text-gray-600">
          Discover and install powerful Claude Code hooks
        </p>
      </header>

      <div className="max-w-7xl mx-auto mb-6 space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <div className="flex justify-between items-center">
          <FilterPanel
            eventType={eventTypeFilter}
            language={languageFilter}
            category={categoryFilter}
            onEventTypeChange={setEventTypeFilter}
            onLanguageChange={setLanguageFilter}
            onCategoryChange={setCategoryFilter}
            onClear={handleClearFilters}
          />

          <SortControl value={sortBy} onChange={setSortBy} />
        </div>

        <p className="text-sm text-gray-600">
          Showing {filteredAndSortedHooks.length} of {hooksData.hooks.length} hooks
        </p>
      </div>

      <HookGrid hooks={filteredAndSortedHooks} onHookClick={setSelectedHook} />

      {selectedHook && (
        <HookDetailModal hook={selectedHook} onClose={() => setSelectedHook(null)} />
      )}
    </main>
  );
}
