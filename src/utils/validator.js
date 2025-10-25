export const validatePortfolio = (portfolio) => {
  const warnings = [];
  const errors = [];

  // Required fields
  if (!portfolio.meta.name || portfolio.meta.name.trim() === '') {
    errors.push('Name is required');
  }

  if (!portfolio.meta.title || portfolio.meta.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!portfolio.meta.bio || portfolio.meta.bio.trim() === '') {
    errors.push('Bio is required');
  }

  // Warnings
  if (!portfolio.meta.profileImage) {
    warnings.push('Profile image is recommended for better visual impact');
  }

  if (portfolio.projects.length === 0) {
    errors.push('Add at least one project');
  }

  portfolio.projects.forEach((project, idx) => {
    if (!project.title.trim()) {
      errors.push(`Project ${idx + 1}: Title is required`);
    }
    if (!project.description.trim()) {
      errors.push(`Project ${idx + 1}: Description is required`);
    }
    if (!project.screenshot) {
      warnings.push(`Project ${idx + 1}: Screenshot is recommended`);
    }
    if (!project.liveUrl && !project.repoUrl) {
      warnings.push(`Project ${idx + 1}: Add at least a Live URL or Repository link`);
    }
  });

  if (portfolio.skills.length === 0) {
    warnings.push('Add some skills to showcase your expertise');
  }

  if (!portfolio.contact.email && !portfolio.contact.github && !portfolio.contact.linkedin) {
    warnings.push('Add at least one contact link');
  }

  return { errors, warnings, isValid: errors.length === 0 };
};

export const checkAccessibility = (portfolio) => {
  const issues = [];

  // Check for alt text in projects
  portfolio.projects.forEach((project, idx) => {
    if (project.screenshot && !project.title) {
      issues.push(`Project ${idx + 1}: Add a title for better accessibility`);
    }
  });

  // Color contrast warning (simple check)
  const primaryColor = portfolio.meta.colors.primary;
  const accentColor = portfolio.meta.colors.accent;
  
  if (primaryColor === accentColor) {
    issues.push('Primary and Accent colors should be different for better contrast');
  }

  return issues;
};


