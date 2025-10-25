
export const generateREADME = (portfolio) => {
  return `# ${portfolio.meta.name}

${portfolio.meta.title}

## About Me

${portfolio.meta.bio}

## Skills

${portfolio.skills.map(skill => `- ${skill}`).join('\n')}

## Projects

${portfolio.projects.map(project => `
### ${project.title}

${project.description}

**Tech Stack:** ${project.tech.join(', ')}

${project.liveUrl ? `[View Live](${project.liveUrl})` : ''} ${project.repoUrl ? `| [Repository](${project.repoUrl})` : ''}
`).join('\n')}

## Contact

${portfolio.contact.email ? `📧 Email: ${portfolio.contact.email}\n` : ''}
${portfolio.contact.github ? `🐙 GitHub: ${portfolio.contact.github}\n` : ''}
${portfolio.contact.linkedin ? `💼 LinkedIn: ${portfolio.contact.linkedin}\n` : ''}
${portfolio.contact.website ? `🌐 Website: ${portfolio.contact.website}\n` : ''}

---

Portfolio built with [Creavyn](https://github.com/yourusername/creavyn) Portfolio Builder
`;
};
