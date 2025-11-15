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
