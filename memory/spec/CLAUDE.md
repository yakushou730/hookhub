# HookHub - Product Specification Document

**Version:** 1.0 (MVP)
**Last Updated:** 2025-11-14
**Status:** Draft

---

## 1. Project Overview

### 1.1 Vision

HookHub is a community-driven catalog that makes discovering, exploring, and installing Claude Code hooks effortless. It serves as the central hub for the growing ecosystem of open-source Claude hooks, helping developers enhance their AI-assisted development workflow.

### 1.2 Problem Statement

Claude Code hooks are powerful automation scripts that extend Claude's capabilities, but they are scattered across GitHub repositories with no centralized discovery mechanism. Developers struggle to:
- Find hooks that solve their specific needs
- Understand what hooks do without reading implementation code
- Compare similar hooks to choose the best fit
- Install hooks quickly with correct configuration

### 1.3 Target Audience

**Primary Users:**
- Claude Code users looking to enhance their development workflow
- Developers seeking automation for security, testing, or quality enforcement
- Teams wanting to standardize their Claude Code practices

**Secondary Users:**
- Hook authors wanting to showcase their work
- Open source contributors exploring the hooks ecosystem

### 1.4 MVP Goals

**Must Have:**
1. Display curated collection of Claude hooks in an attractive grid layout
2. Enable search and filtering by category, event type, and language
3. Provide detailed view of each hook with installation instructions
4. Allow sorting by popularity (GitHub stars), recency, and name
5. One-click copy of installation commands

**Nice to Have (Future):**
- User ratings and reviews
- Installation analytics
- Hook author profiles
- Direct GitHub integration
- Submission system for new hooks

**Out of Scope for MVP:**
- User authentication
- Hook hosting/execution
- Version management
- Dependency resolution
- Automated testing of hooks

---

## 2. Core Features

### 2.1 Grid Display

**Description:** Main landing page displays hooks in a responsive card grid layout.

**User Story:** As a developer, I want to browse available hooks at a glance so I can quickly identify potentially useful ones.

**Acceptance Criteria:**
- ✅ Displays 12+ hooks in a responsive grid (3-4 columns on desktop, 1-2 on mobile)
- ✅ Each card shows: name, description (truncated), category badge, event type, language icon, star count
- ✅ Cards have hover effects for visual feedback
- ✅ Grid layout adapts to screen size
- ✅ Loading state handled gracefully

**Technical Notes:**
- Use CSS Grid via Tailwind
- Lazy load hook cards if list grows large
- Skeleton loaders during initial load

### 2.2 Search and Filtering

**Description:** Users can search by name/description and filter by multiple criteria.

**User Story:** As a developer, I want to filter hooks by event type and language so I can find exactly what I need for my workflow.

**Acceptance Criteria:**
- ✅ Search input filters hooks by name and description (case-insensitive)
- ✅ Filter by event type (UserPromptSubmit, PreToolUse, PostToolUse, Stop, etc.)
- ✅ Filter by language (Python, Shell, TypeScript, JavaScript)
- ✅ Filter by category (Security, Quality, Automation, etc.)
- ✅ Multiple filters can be applied simultaneously (AND logic)
- ✅ Clear filters button resets all filters
- ✅ Results update in real-time as filters change
- ✅ Display count of filtered results (e.g., "Showing 5 of 23 hooks")

**Technical Notes:**
- Client-side filtering using React state
- Debounce search input (300ms) for performance
- URL query params for shareable filtered views (future enhancement)

### 2.3 Sort Functionality

**Description:** Users can sort the hook list by different criteria.

**User Story:** As a developer, I want to sort hooks by popularity so I can see the most trusted and widely-used options first.

**Acceptance Criteria:**
- ✅ Sort by: Most Stars, Recently Updated, Name (A-Z), Name (Z-A)
- ✅ Default sort is "Most Stars"
- ✅ Sort control is clearly visible and accessible
- ✅ Sort persists when filters are applied
- ✅ Visual indicator shows current sort order

**Technical Notes:**
- Dropdown or button group for sort selection
- Combine with filtering logic seamlessly

### 2.4 Detailed Hook View

**Description:** Clicking a hook card opens a detailed view with comprehensive information.

**User Story:** As a developer, I want to see detailed information about a hook including installation steps so I can quickly set it up in my project.

**Acceptance Criteria:**
- ✅ Modal or dedicated page shows full hook details
- ✅ Displays: full description, all metadata, use cases, installation instructions
- ✅ Shows code snippet preview (if available)
- ✅ Links to source repository open in new tab
- ✅ Easy to close/navigate back to grid
- ✅ Supports keyboard navigation (ESC to close modal)

**Sections in Detail View:**
1. **Header:** Name, author, event type badge, language icon
2. **Stats:** GitHub stars, last updated, complexity level
3. **Description:** Full description and use cases
4. **Installation:** Step-by-step guide with copy buttons
5. **Technical Details:** Dependencies, configuration requirements, supported frameworks
6. **Links:** GitHub repo, issues, pull requests

**Technical Notes:**
- Use Next.js modal routing or dedicated `/hook/[id]` route
- Consider modal for MVP (faster UX)
- Markdown rendering for description if needed

### 2.5 Copy Installation Command

**Description:** One-click copy of hook installation/setup commands.

**User Story:** As a developer, I want to copy installation commands with one click so I can quickly add hooks to my project without typing.

**Acceptance Criteria:**
- ✅ "Copy" button next to installation commands
- ✅ Visual feedback on successful copy (checkmark icon, toast notification)
- ✅ Works across all modern browsers
- ✅ Handles multi-line commands correctly
- ✅ Falls back gracefully if clipboard API unavailable

**Installation Command Format:**
```bash
# Download hook
curl -o .claude/hooks/hook-name.py https://raw.githubusercontent.com/...

# Make executable
chmod +x .claude/hooks/hook-name.py

# Update .claude/settings.json (manual step - show snippet)
```

**Technical Notes:**
- Use navigator.clipboard.writeText API
- Provide fallback for older browsers
- Consider syntax highlighting for commands

---

## 3. Data Model

### 3.1 Hook Schema

**TypeScript Interface:**

```typescript
interface Hook {
  // Unique Identifier
  id: string; // e.g., "security-guard-pretooluse"

  // Basic Information
  name: string; // Display name, e.g., "Security Guard"
  description: string; // Short description (1-2 sentences)
  longDescription?: string; // Detailed description (markdown supported)

  // Repository Info
  repository: {
    url: string; // GitHub repo URL
    owner: string; // GitHub username/org
    name: string; // Repo name
    stars: number; // Star count
    lastUpdated: string; // ISO 8601 date
  };

  // Author Information
  author: {
    name: string;
    githubUsername: string;
    url?: string; // Author's website or GitHub profile
  };

  // Hook Classification
  eventType: EventType; // Which lifecycle event it hooks into
  category: Category; // Primary category
  tags: string[]; // Additional searchable tags

  // Technical Details
  language: Language; // Implementation language
  canBlock: boolean; // Whether hook can block operations
  complexity: 'beginner' | 'intermediate' | 'advanced';

  // Installation
  installationPath: string; // Typical file path, e.g., ".claude/hooks/pre_tool_use.py"
  dependencies: string[]; // Required packages, e.g., ["anthropic", "requests"]
  requiresConfiguration: boolean;
  configurationExample?: string; // JSON snippet for settings.json

  // Documentation
  useCases: string[]; // List of specific use cases
  installTime: number; // Estimated minutes to install
  documentation?: string; // Markdown documentation
  codePreview?: string; // Sample code snippet

  // Integration
  requiresApiKey: boolean;
  externalServices: string[]; // e.g., ["Anthropic API", "Ollama"]
  compatibleWith?: string[]; // Other hook IDs it works well with
  supports?: string[]; // Languages/frameworks, e.g., ["TypeScript", "Python"]
}

// Enums
enum EventType {
  UserPromptSubmit = 'UserPromptSubmit',
  PreToolUse = 'PreToolUse',
  PostToolUse = 'PostToolUse',
  Stop = 'Stop',
  SubagentStop = 'SubagentStop',
  SessionStart = 'SessionStart',
  Notification = 'Notification',
  PreCompact = 'PreCompact',
}

enum Category {
  Security = 'Security',
  Quality = 'Quality',
  Automation = 'Automation',
  Monitoring = 'Monitoring',
  Context = 'Context',
  TDD = 'TDD',
  Documentation = 'Documentation',
}

enum Language {
  Python = 'Python',
  Shell = 'Shell',
  TypeScript = 'TypeScript',
  JavaScript = 'JavaScript',
}
```

### 3.2 Static Data Structure

**File Location:** `/hookhub/src/data/hooks.json`

**Format:**

```json
{
  "version": "1.0",
  "lastUpdated": "2025-11-14",
  "hooks": [
    {
      "id": "security-guard-pretooluse",
      "name": "Security Guard",
      "description": "Blocks dangerous commands and protects sensitive files from accidental access or deletion.",
      "longDescription": "A comprehensive security hook that validates all tool operations before execution. Prevents destructive commands like `rm -rf /`, blocks access to `.env` files, and logs all operations for audit trails.",
      "repository": {
        "url": "https://github.com/disler/claude-code-hooks-mastery",
        "owner": "disler",
        "name": "claude-code-hooks-mastery",
        "stars": 1796,
        "lastUpdated": "2025-11-10"
      },
      "author": {
        "name": "David Disler",
        "githubUsername": "disler"
      },
      "eventType": "PreToolUse",
      "category": "Security",
      "tags": ["security", "validation", "safety", "permissions"],
      "language": "Python",
      "canBlock": true,
      "complexity": "intermediate",
      "installationPath": ".claude/hooks/pre_tool_use.py",
      "dependencies": ["uv"],
      "requiresConfiguration": true,
      "configurationExample": "{\n  \"hooks\": {\n    \"PreToolUse\": [{\n      \"name\": \"security-guard\",\n      \"matcher\": \"Bash|Write|Edit\",\n      \"type\": \"command\",\n      \"command\": \".claude/hooks/pre_tool_use.py\"\n    }]\n  }\n}",
      "useCases": [
        "Prevent accidental file deletion",
        "Protect environment variables and secrets",
        "Block dangerous shell commands",
        "Audit trail for security compliance"
      ],
      "installTime": 5,
      "requiresApiKey": false,
      "externalServices": [],
      "supports": ["All languages"]
    }
    // ... more hooks
  ]
}
```

### 3.3 Sample Hook Data (MVP)

For the MVP, include 15-20 curated hooks covering:
- **Security:** Security Guard, Sensitive File Protector
- **TDD:** TDD Guard (multi-language), Test-First Enforcer
- **Quality:** ESLint Runner, Type Checker, Code Review Trigger
- **Automation:** Auto-commit, Codebase Map Updater, Transcript Converter
- **Context:** Skill Auto-Activation, Session Manager, Project Context Injector
- **Monitoring:** Post-Tool Logger, Performance Profiler, Change Tracker
- **Documentation:** README Generator, API Doc Updater

**Data Source Strategy:**
1. Manually curate from top GitHub repos
2. Extract metadata from READMEs and code
3. Validate GitHub stars via API (one-time fetch)
4. Store in static JSON file
5. Plan for future dynamic updates (out of scope for MVP)

---

## 4. Component Architecture

### 4.1 Page Structure (Next.js App Router)

```
hookhub/src/app/
├── layout.tsx                 # Root layout (existing)
├── page.tsx                   # Home page (main hook grid)
├── hooks/
│   └── [id]/
│       └── page.tsx          # Individual hook detail page (optional for MVP)
└── globals.css               # Global styles (existing)
```

**Alternative Modal Approach (Recommended for MVP):**
- Keep single page with modal for details
- Faster UX, simpler routing
- Use `useSearchParams` for shareable links

### 4.2 Component Breakdown

#### 4.2.1 Page Component (`page.tsx`)

**Responsibilities:**
- Load hooks data from JSON
- Manage global state (search, filters, sort)
- Orchestrate child components
- Handle modal open/close

**Implementation:**

```typescript
// hookhub/src/app/page.tsx
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

  // Filtering and sorting logic
  const filteredAndSortedHooks = useMemo(() => {
    let result = hooksData.hooks as Hook[];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        hook =>
          hook.name.toLowerCase().includes(query) ||
          hook.description.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (eventTypeFilter) {
      result = result.filter(hook => hook.eventType === eventTypeFilter);
    }
    if (languageFilter) {
      result = result.filter(hook => hook.language === languageFilter);
    }
    if (categoryFilter) {
      result = result.filter(hook => hook.category === categoryFilter);
    }

    // Apply sorting
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

  const clearFilters = () => {
    setSearchQuery('');
    setEventTypeFilter(null);
    setLanguageFilter(null);
    setCategoryFilter(null);
  };

  return (
    <main className="min-h-screen p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-2">HookHub</h1>
        <p className="text-gray-600">
          Discover and install powerful Claude Code hooks
        </p>
      </header>

      {/* Search and Controls */}
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
            onClear={clearFilters}
          />

          <SortControl value={sortBy} onChange={setSortBy} />
        </div>

        <p className="text-sm text-gray-600">
          Showing {filteredAndSortedHooks.length} of {hooksData.hooks.length} hooks
        </p>
      </div>

      {/* Grid */}
      <HookGrid hooks={filteredAndSortedHooks} onHookClick={setSelectedHook} />

      {/* Detail Modal */}
      {selectedHook && (
        <HookDetailModal hook={selectedHook} onClose={() => setSelectedHook(null)} />
      )}
    </main>
  );
}
```

#### 4.2.2 HookGrid Component

**Props:**

```typescript
interface HookGridProps {
  hooks: Hook[];
  onHookClick: (hook: Hook) => void;
}
```

**Responsibilities:**
- Render grid layout
- Handle empty state
- Pass hook data to cards

**Implementation:**

```typescript
// hookhub/src/components/HookGrid.tsx
import { HookCard } from './HookCard';
import type { Hook } from '@/types/hook';

interface HookGridProps {
  hooks: Hook[];
  onHookClick: (hook: Hook) => void;
}

export function HookGrid({ hooks, onHookClick }: HookGridProps) {
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
}
```

#### 4.2.3 HookCard Component

**Props:**

```typescript
interface HookCardProps {
  hook: Hook;
  onClick: () => void;
}
```

**Responsibilities:**
- Display hook summary
- Visual badges and indicators
- Hover effects
- Click handling

**Implementation:**

```typescript
// hookhub/src/components/HookCard.tsx
import { StarIcon, CodeBracketIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import type { Hook } from '@/types/hook';

interface HookCardProps {
  hook: Hook;
  onClick: () => void;
}

export function HookCard({ hook, onClick }: HookCardProps) {
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
}

function getCategoryColor(category: string): string {
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
}
```

#### 4.2.4 SearchBar Component

**Props:**

```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}
```

**Implementation:**

```typescript
// hookhub/src/components/SearchBar.tsx
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search hooks by name or description..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
```

#### 4.2.5 FilterPanel Component

**Props:**

```typescript
interface FilterPanelProps {
  eventType: EventType | null;
  language: Language | null;
  category: Category | null;
  onEventTypeChange: (value: EventType | null) => void;
  onLanguageChange: (value: Language | null) => void;
  onCategoryChange: (value: Category | null) => void;
  onClear: () => void;
}
```

**Implementation:**

```typescript
// hookhub/src/components/FilterPanel.tsx
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

export function FilterPanel({
  eventType,
  language,
  category,
  onEventTypeChange,
  onLanguageChange,
  onCategoryChange,
  onClear,
}: FilterPanelProps) {
  const hasActiveFilters = eventType || language || category;

  return (
    <div className="flex gap-4 items-center">
      <span className="text-sm font-medium">Filters:</span>

      {/* Event Type Filter */}
      <select
        value={eventType || ''}
        onChange={e => onEventTypeChange(e.target.value as EventType || null)}
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
        onChange={e => onLanguageChange(e.target.value as Language || null)}
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
        onChange={e => onCategoryChange(e.target.value as Category || null)}
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
}
```

#### 4.2.6 SortControl Component

**Props:**

```typescript
interface SortControlProps {
  value: 'stars' | 'updated' | 'name-asc' | 'name-desc';
  onChange: (value: 'stars' | 'updated' | 'name-asc' | 'name-desc') => void;
}
```

**Implementation:**

```typescript
// hookhub/src/components/SortControl.tsx
interface SortControlProps {
  value: 'stars' | 'updated' | 'name-asc' | 'name-desc';
  onChange: (value: 'stars' | 'updated' | 'name-asc' | 'name-desc') => void;
}

export function SortControl({ value, onChange }: SortControlProps) {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm font-medium">Sort by:</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value as any)}
        className="px-3 py-1 border rounded text-sm"
      >
        <option value="stars">Most Stars</option>
        <option value="updated">Recently Updated</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
      </select>
    </div>
  );
}
```

#### 4.2.7 HookDetailModal Component

**Props:**

```typescript
interface HookDetailModalProps {
  hook: Hook;
  onClose: () => void;
}
```

**Responsibilities:**
- Display comprehensive hook information
- Show installation instructions
- Copy-to-clipboard functionality
- Modal overlay and keyboard handling

**Implementation:**

```typescript
// hookhub/src/components/HookDetailModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import type { Hook } from '@/types/hook';

interface HookDetailModalProps {
  hook: Hook;
  onClose: () => void;
}

export function HookDetailModal({ hook, onClose }: HookDetailModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const installationSteps = [
    {
      label: 'Download the hook',
      command: `curl -o ${hook.installationPath} ${hook.repository.url}/raw/main/${hook.installationPath}`,
    },
    {
      label: 'Make it executable',
      command: `chmod +x ${hook.installationPath}`,
    },
    {
      label: 'Update .claude/settings.json',
      command: hook.configurationExample || '// See repository for configuration example',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{hook.name}</h2>
            <div className="flex gap-2 items-center text-sm text-gray-600">
              <span>by {hook.author.name}</span>
              <span>•</span>
              <a
                href={hook.repository.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {hook.repository.owner}/{hook.repository.name}
              </a>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Badges and Stats */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-2">
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
            <div className="text-sm text-gray-600 flex gap-4">
              <span>⭐ {hook.repository.stars.toLocaleString()} stars</span>
              <span>🔧 {hook.complexity}</span>
              <span>⏱️ ~{hook.installTime} min install</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{hook.longDescription || hook.description}</p>
          </div>

          {/* Use Cases */}
          {hook.useCases.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Use Cases</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {hook.useCases.map((useCase, i) => (
                  <li key={i}>{useCase}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Installation */}
          <div>
            <h3 className="font-semibold mb-3">Installation</h3>
            <div className="space-y-3">
              {installationSteps.map((step, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {index + 1}. {step.label}
                    </span>
                    <button
                      onClick={() => copyToClipboard(step.command, index)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      {copiedIndex === index ? (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardIcon className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                    <code>{step.command}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Details */}
          <div>
            <h3 className="font-semibold mb-2">Technical Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Can Block:</span>{' '}
                <span className="text-gray-700">{hook.canBlock ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="font-medium">Requires API Key:</span>{' '}
                <span className="text-gray-700">{hook.requiresApiKey ? 'Yes' : 'No'}</span>
              </div>
              {hook.dependencies.length > 0 && (
                <div className="col-span-2">
                  <span className="font-medium">Dependencies:</span>{' '}
                  <span className="text-gray-700">{hook.dependencies.join(', ')}</span>
                </div>
              )}
              {hook.externalServices.length > 0 && (
                <div className="col-span-2">
                  <span className="font-medium">External Services:</span>{' '}
                  <span className="text-gray-700">{hook.externalServices.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(category: string): string {
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
}
```

---

## 5. UI/UX Specifications

### 5.1 Design Principles

- **Clean and Modern:** Minimalist design with clear visual hierarchy
- **Responsive:** Mobile-first approach, works on all screen sizes
- **Fast:** Instant search and filtering, no unnecessary loading states
- **Accessible:** Keyboard navigation, semantic HTML, ARIA labels
- **Consistent:** Use Tailwind's design tokens for spacing, colors, typography

### 5.2 Color Palette

**Category Colors (for badges):**
- Security: Red (`bg-red-100 text-red-700`)
- Quality: Green (`bg-green-100 text-green-700`)
- Automation: Purple (`bg-purple-100 text-purple-700`)
- Monitoring: Blue (`bg-blue-100 text-blue-700`)
- Context: Yellow (`bg-yellow-100 text-yellow-700`)
- TDD: Indigo (`bg-indigo-100 text-indigo-700`)
- Documentation: Pink (`bg-pink-100 text-pink-700`)

**UI Colors:**
- Primary: Blue 600 (`#2563eb`)
- Text: Gray 900, 700, 600 (`#111827`, `#374151`, `#4b5563`)
- Border: Gray 200 (`#e5e7eb`)
- Background: White, Gray 50, Gray 100

### 5.3 Typography

**From existing layout.tsx:**
- Body: Geist Sans (next/font/google)
- Mono: Geist Mono (for code snippets)

**Sizes:**
- H1 (Page Title): `text-4xl font-bold`
- H2 (Modal Title): `text-2xl font-bold`
- H3 (Section Headers): `text-xl font-semibold` or `font-semibold`
- Body: `text-base` (default)
- Small: `text-sm`
- Extra Small: `text-xs` (badges)

### 5.4 Spacing

- Container max width: `max-w-7xl`
- Grid gap: `gap-6`
- Card padding: `p-6`
- Section spacing: `space-y-6` or `mb-6`

### 5.5 Interactive States

**Cards:**
- Default: `border rounded-lg bg-white`
- Hover: `hover:shadow-lg transition-shadow cursor-pointer`
- Active: Slightly darker shadow

**Buttons:**
- Primary: `bg-blue-600 text-white hover:bg-blue-700 rounded px-4 py-2`
- Secondary: `border text-gray-700 hover:bg-gray-50 rounded px-3 py-1`
- Copy: Icon + text, changes to checkmark on success

**Inputs/Selects:**
- Default: `border rounded px-3 py-2`
- Focus: `focus:outline-none focus:ring-2 focus:ring-blue-500`

### 5.6 Responsive Breakpoints

**Grid Layout:**
- Mobile (< 768px): 1 column
- Tablet (768px - 1024px): 2 columns
- Desktop (> 1024px): 3 columns

**Tailwind Classes:**
```css
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

### 5.7 Icons

Use **Heroicons** (already compatible with Next.js/React):
- Search: `MagnifyingGlassIcon`
- Star: `StarIcon`
- Code: `CodeBracketIcon`
- Close: `XMarkIcon`
- Copy: `ClipboardIcon`
- Copied: `CheckIcon`
- Block indicator: `ShieldCheckIcon`

Install: `npm install @heroicons/react`

---

## 6. Technical Implementation

### 6.1 Technology Stack

**Framework:** Next.js 15.5.4 (App Router)
**React:** 19.1.0
**TypeScript:** Strict mode
**Styling:** Tailwind CSS v4
**Build Tool:** Turbopack
**Icons:** Heroicons v2

**New Dependencies to Add:**
```json
{
  "@heroicons/react": "^2.1.1"
}
```

### 6.2 File Structure

```
hookhub/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (existing)
│   │   ├── page.tsx                # Main page with grid
│   │   └── globals.css             # Global styles (existing)
│   ├── components/
│   │   ├── HookGrid.tsx            # Grid container
│   │   ├── HookCard.tsx            # Individual card
│   │   ├── SearchBar.tsx           # Search input
│   │   ├── FilterPanel.tsx         # Filter dropdowns
│   │   ├── SortControl.tsx         # Sort dropdown
│   │   └── HookDetailModal.tsx     # Detail modal
│   ├── data/
│   │   └── hooks.json              # Static hook data
│   └── types/
│       └── hook.ts                 # TypeScript interfaces
├── public/                         # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts              # Tailwind configuration
```

### 6.3 TypeScript Configuration

**Types file:** `hookhub/src/types/hook.ts`

```typescript
export enum EventType {
  UserPromptSubmit = 'UserPromptSubmit',
  PreToolUse = 'PreToolUse',
  PostToolUse = 'PostToolUse',
  Stop = 'Stop',
  SubagentStop = 'SubagentStop',
  SessionStart = 'SessionStart',
  Notification = 'Notification',
  PreCompact = 'PreCompact',
}

export enum Category {
  Security = 'Security',
  Quality = 'Quality',
  Automation = 'Automation',
  Monitoring = 'Monitoring',
  Context = 'Context',
  TDD = 'TDD',
  Documentation = 'Documentation',
}

export enum Language {
  Python = 'Python',
  Shell = 'Shell',
  TypeScript = 'TypeScript',
  JavaScript = 'JavaScript',
}

export interface Hook {
  id: string;
  name: string;
  description: string;
  longDescription?: string;

  repository: {
    url: string;
    owner: string;
    name: string;
    stars: number;
    lastUpdated: string;
  };

  author: {
    name: string;
    githubUsername: string;
    url?: string;
  };

  eventType: EventType;
  category: Category;
  tags: string[];

  language: Language;
  canBlock: boolean;
  complexity: 'beginner' | 'intermediate' | 'advanced';

  installationPath: string;
  dependencies: string[];
  requiresConfiguration: boolean;
  configurationExample?: string;

  useCases: string[];
  installTime: number;
  documentation?: string;
  codePreview?: string;

  requiresApiKey: boolean;
  externalServices: string[];
  compatibleWith?: string[];
  supports?: string[];
}
```

### 6.4 Client vs Server Components

**Client Components (need state/interactivity):**
- `page.tsx` - Manages search, filter, sort state
- `HookDetailModal.tsx` - Handles modal open/close, keyboard events
- `SearchBar.tsx` - Controlled input
- `FilterPanel.tsx` - Dropdown selections
- `SortControl.tsx` - Dropdown selection

**Server Components (could be server-rendered):**
- `HookGrid.tsx` - Pure display, receives data as props
- `HookCard.tsx` - Pure display, receives data as props

**Note:** For MVP simplicity, mark root `page.tsx` as `'use client'` and keep all components client-side. Optimization can happen post-MVP.

### 6.5 Data Loading Strategy

**Static JSON Approach:**

1. Create `hookhub/src/data/hooks.json`
2. Import directly in components: `import hooksData from '@/data/hooks.json'`
3. No API calls, instant loading
4. TypeScript validates structure at build time

**Pros:**
- Fastest loading (bundled with app)
- No backend needed
- Perfect for MVP (< 100 hooks)
- Easy to update manually

**Cons:**
- Requires rebuild to update data
- Not scalable beyond ~100 hooks
- No user-submitted hooks

**Future Enhancement Path:**
- Add API endpoint (`/api/hooks`)
- Fetch from database (Supabase, Postgres)
- Implement caching with SWR or React Query
- Add submission system

### 6.6 Performance Considerations

**Optimizations:**
- Use `useMemo` for filtering/sorting to avoid recalculation
- Debounce search input (300ms)
- Lazy load images if hook cards include screenshots
- Consider virtualization if list exceeds 50+ items (react-window)
- Static JSON eliminates network requests

**Lighthouse Goals:**
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 90+

---

## 7. Testing Strategy (Post-MVP)

### 7.1 Unit Tests

**Framework:** Jest + React Testing Library

**Component Tests:**
- HookCard renders correctly with all data
- SearchBar filters hooks accurately
- FilterPanel applies multiple filters
- SortControl sorts by all options
- Copy button successfully copies to clipboard

### 7.2 Integration Tests

**User Flows:**
1. User searches for "security" → sees filtered results
2. User applies event type filter → results update
3. User clicks hook card → modal opens with details
4. User copies installation command → clipboard contains correct text
5. User clears filters → all hooks displayed

### 7.3 E2E Tests

**Framework:** Playwright

**Critical Paths:**
- Homepage loads with all hooks
- Search and filter combination works
- Modal opens, displays data, and closes
- Responsive layout works on mobile

---

## 8. Deployment Plan (Post-MVP)

### 8.1 Hosting Options

**Recommended:** Vercel (optimized for Next.js)
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Free tier sufficient for MVP

**Alternatives:**
- Netlify
- Cloudflare Pages
- AWS Amplify

### 8.2 Domain

- Suggestion: `hookhub.dev` or `claudehooks.com`
- Configure DNS to point to Vercel

### 8.3 CI/CD

**GitHub Actions Workflow:**
1. Run TypeScript type checking
2. Run ESLint
3. Build Next.js app
4. Deploy to Vercel on push to `main`

### 8.4 Analytics (Optional)

- Vercel Analytics (built-in)
- Google Analytics or Plausible
- Track: page views, search queries, popular hooks

---

## 9. Future Enhancements (Post-MVP)

### 9.1 Phase 2 Features

**Priority 1:**
- User authentication (GitHub OAuth)
- User-submitted hooks (with moderation)
- Hook ratings and reviews
- Installation analytics (download counts)

**Priority 2:**
- Hook versioning
- Dependency checker (compatibility warnings)
- "Install with one click" (generates settings.json snippet)
- Hook collections/playlists

**Priority 3:**
- Hook editor/playground (test hooks in browser)
- Community discussions (comments, Q&A)
- Hook author profiles
- Verified/official badges

### 9.2 Technical Improvements

- Migrate to database (PostgreSQL + Prisma)
- Implement GraphQL API
- Add full-text search (Algolia or Meilisearch)
- Server-side rendering for SEO
- Progressive Web App (PWA)
- Dark mode

### 9.3 Content Expansion

- Weekly featured hooks
- Hook creation tutorials
- Blog with best practices
- Video demonstrations
- Integration guides

---

## 10. Success Metrics

### 10.1 MVP Success Criteria

**Quantitative:**
- 100+ unique visitors in first week
- 10+ GitHub stars
- 5+ community contributions (PRs, issues)
- < 2s page load time
- 0 critical accessibility issues

**Qualitative:**
- Positive feedback on Reddit/HN
- Hook authors sharing the site
- Users reporting successful installations
- Clear, easy-to-understand UI

### 10.2 Long-term KPIs

- Monthly active users (MAU)
- Hooks installed via HookHub (tracking parameter in URLs)
- User-submitted hooks per month
- Community engagement (comments, reviews)
- Search-to-install conversion rate

---

## 11. Open Questions & Decisions

### 11.1 Resolved for MVP

✅ Data source: Static JSON file
✅ Format: Markdown spec in `/spec/CLAUDE.md`
✅ Features: Search, filter, sort, detail view, copy commands
✅ Detail level: Comprehensive specification with component breakdown

### 11.2 To Be Decided

**Design:**
- [ ] Logo and branding (color scheme, typography beyond Tailwind defaults)
- [ ] Hero section on homepage (marketing copy, call-to-action)
- [ ] Favicon and social sharing image (OG tags)

**Content:**
- [ ] Initial set of 15-20 curated hooks (which repositories to prioritize)
- [ ] Hook data validation (who reviews/approves hooks)
- [ ] Update frequency (manual monthly vs automated)

**Technical:**
- [ ] Error handling (failed clipboard copy, missing data fields)
- [ ] Loading states (skeleton screens vs spinners)
- [ ] 404 page design
- [ ] SEO metadata (title, description, keywords)

---

## 12. Appendix

### 12.1 Reference Links

**Claude Code Documentation:**
- Hooks overview: https://docs.claude.com/en/docs/claude-code/hooks
- Settings configuration: https://docs.claude.com/en/docs/claude-code/settings

**Popular Hook Repositories:**
- claude-code-hooks-mastery: https://github.com/disler/claude-code-hooks-mastery
- tdd-guard: https://github.com/nizos/tdd-guard
- claude-code-infrastructure-showcase: https://github.com/diet103/claude-code-infrastructure-showcase
- Claude-Code-Development-Kit: https://github.com/peterkrueck/Claude-Code-Development-Kit
- claudekit: https://github.com/carlrannaberg/claudekit

**Design Inspiration:**
- npm package registry: https://www.npmjs.com
- VS Code marketplace: https://marketplace.visualstudio.com
- GitHub topics: https://github.com/topics

### 12.2 Glossary

- **Hook:** Automated script that triggers on Claude Code lifecycle events
- **Event Type:** Specific lifecycle event (PreToolUse, PostToolUse, etc.)
- **Can Block:** Hook has ability to prevent operations from executing
- **Matcher:** Regex pattern that determines which tools a hook applies to
- **Session:** Single interaction session with Claude Code
- **Tool:** Claude Code action (Read, Write, Edit, Bash, etc.)

### 12.3 Initial Hook Candidates (20)

1. **Security Guard** (PreToolUse, Python) - Blocks dangerous commands
2. **TDD Guard** (PreToolUse, Python) - Enforces test-driven development
3. **Skill Auto-Activation** (UserPromptSubmit, Shell) - Analyzes prompts for skill suggestions
4. **Post-Tool Logger** (PostToolUse, Python) - Comprehensive operation logging
5. **Transcript Converter** (PostToolUse, Python) - Converts sessions to markdown
6. **Sensitive File Protector** (PreToolUse, Python) - Blocks .env, secrets access
7. **Type Checker** (Stop, Shell) - Runs TypeScript type checking before completion
8. **ESLint Runner** (Stop, Shell) - Enforces linting before completion
9. **Auto-Committer** (Stop, Shell) - Creates git commits on completion
10. **Codebase Map Updater** (PostToolUse, TypeScript) - Incrementally updates context
11. **Session Manager** (SessionStart, Python) - Initializes session state
12. **Performance Profiler** (PostToolUse, Python) - Tracks operation timing
13. **Change Tracker** (PostToolUse, Python) - Monitors file modifications
14. **Code Review Trigger** (Stop, Shell) - Suggests code review on completion
15. **README Generator** (Stop, TypeScript) - Auto-generates documentation
16. **Test Runner** (Stop, Shell) - Runs test suite before completion
17. **Build Validator** (Stop, Shell) - Ensures build succeeds
18. **API Doc Updater** (PostToolUse, TypeScript) - Updates API documentation
19. **Context Injector** (UserPromptSubmit, Python) - Adds project context to prompts
20. **Notification Bell** (Notification, Python) - Audio feedback for events

---

**End of Specification**
