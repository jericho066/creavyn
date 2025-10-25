
const DRAFT_KEY = 'devportfolio:draft:v1';

export const saveDraft = (portfolioData) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(portfolioData));
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
};

export const loadDraft = () => {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
};

export const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Failed to clear draft:', error);
  }
};

export const exportJSON = (portfolioData, filename = 'portfolio.json') => {
  const json = JSON.stringify(portfolioData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const importJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
