'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import type { Hook } from '@/types/hook';

interface HookDetailModalProps {
  hook: Hook;
  onClose: () => void;
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

export const HookDetailModal = ({ hook, onClose }: HookDetailModalProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleCopyToClipboard = async (text: string, index: number) => {
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
                      onClick={() => handleCopyToClipboard(step.command, index)}
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
};
