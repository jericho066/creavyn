export const minimalTemplate = (data) => {
  const projectsHtml = data.projects
    .sort((a, b) => a.order - b.order)
    .map(
      (project) => `
    <article class="project-card">
      ${
        project.screenshot
          ? `<img src="${project.screenshot}" alt="${project.title}" class="project-image">`
          : ''
      }
      <h3>${project.title}</h3>
      <p class="project-description">${project.description}</p>
      <div class="tech-tags">
        ${project.tech.map((t) => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="project-links">
        ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">View Live</a>` : ''}
        ${project.repoUrl ? `<a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer">Repository</a>` : ''}
      </div>
    </article>
  `
    )
    .join('');

  const skillsHtml = data.skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join('');

  const contactHtml = [
    data.contact.email ? `<a href="mailto:${data.contact.email}">Email</a>` : '',
    data.contact.github ? `<a href="${data.contact.github}" target="_blank" rel="noopener noreferrer">GitHub</a>` : '',
    data.contact.linkedin ? `<a href="${data.contact.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : '',
    data.contact.website ? `<a href="${data.contact.website}" target="_blank" rel="noopener noreferrer">Website</a>` : '',
  ]
    .filter(Boolean)
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.meta.name} | Portfolio</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #ffffff;
    }

    header {
      padding: 4rem 2rem;
      text-align: center;
      background: linear-gradient(135deg, ${data.meta.colors.primary}, ${data.meta.colors.accent});
      color: white;
    }

    header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    header .title {
      font-size: 1.25rem;
      opacity: 0.95;
      margin-bottom: 1rem;
    }

    header .bio {
      font-size: 1rem;
      max-width: 600px;
      margin: 1rem auto;
      opacity: 0.9;
      line-height: 1.8;
    }

    .profile-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin: 1rem auto 2rem;
      object-fit: cover;
      border: 4px solid rgba(255, 255, 255, 0.3);
    }

    .contact-links {
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .contact-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border: 2px solid rgba(255, 255, 255, 0.5);
      border-radius: 6px;
      transition: all 0.2s;
    }

    .contact-links a:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: white;
    }

    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }

    section {
      margin-bottom: 3rem;
    }

    section h2 {
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
      color: ${data.meta.colors.primary};
      border-bottom: 2px solid ${data.meta.colors.accent};
      padding-bottom: 0.5rem;
    }

    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .skill-tag {
      background: ${data.meta.colors.primary};
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .projects {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }

    .project-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s;
    }

    .project-card:hover {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      transform: translateY(-4px);
    }

    .project-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .project-card h3 {
      font-size: 1.25rem;
      margin: 1rem;
      margin-bottom: 0.5rem;
      color: ${data.meta.colors.primary};
    }

    .project-description {
      padding: 0 1rem;
      font-size: 0.95rem;
      color: #4b5563;
      line-height: 1.6;
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
    }

    .tag {
      background: #f3f4f6;
      color: #374151;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .project-links {
      padding: 1rem;
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .project-links a {
      color: ${data.meta.colors.primary};
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: opacity 0.2s;
    }

    .project-links a:hover {
      opacity: 0.7;
    }

    footer {
      text-align: center;
      padding: 2rem;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      header h1 {
        font-size: 2rem;
      }

      header .title {
        font-size: 1rem;
      }

      main {
        padding: 2rem 1rem;
      }

      .projects {
        grid-template-columns: 1fr;
      }

      section h2 {
        font-size: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <header>
    ${data.meta.profileImage ? `<img src="${data.meta.profileImage}" alt="${data.meta.name}" class="profile-image">` : ''}
    <h1>${data.meta.name}</h1>
    <p class="title">${data.meta.title}</p>
    <p class="bio">${data.meta.bio}</p>
    <div class="contact-links">
      ${contactHtml}
    </div>
  </header>

  <main>
    ${
      data.skills.length > 0
        ? `
    <section>
      <h2>Skills</h2>
      <div class="skills">
        ${skillsHtml}
      </div>
    </section>
    `
        : ''
    }

    ${
      data.projects.length > 0
        ? `
    <section>
      <h2>Projects</h2>
      <div class="projects">
        ${projectsHtml}
      </div>
    </section>
    `
        : ''
    }
  </main>

  <footer>
    <p>Portfolio built with Creavyn Portfolio Builder</p>
  </footer>
</body>
</html>
  `;
};

