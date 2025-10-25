import { v4 as uuidv4 } from 'uuid';

export const defaultPortfolio = {
  meta: {
    name: '',
    title: '',
    bio: '',
    profileImage: null,
    theme: 'minimal',
    colors: {
      primary: '#2563eb',
      accent: '#10b981',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
  },
  contact: {
    email: '',
    website: '',
    github: '',
    linkedin: '',
  },
  skills: [],
  projects: [],
  settings: {
    includeAnalytics: false,
    analyticsSnippet: '',
  },
};

export const samplePortfolio = {
  meta: {
    name: '',
    title: '',
    bio: '',
    profileImage: null,
    theme: 'minimal',
    colors: {
      primary: '#2563eb',
      accent: '#10b981',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
  },
  contact: {
    email: '',
    website: '',
    github: '',
    linkedin: '',
  },
  skills: [],
  projects: [
    {
      id: uuidv4(),
      title: '',
      description: '',
      tech: [],
      liveUrl: '',
      repoUrl: '',
      screenshot: null,
      order: 0,
    },
  ],
  settings: {
    includeAnalytics: false,
    analyticsSnippet: '',
  },
};

