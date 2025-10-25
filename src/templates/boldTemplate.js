
export const boldTemplate = (data) => {
  const projectsHtml = data.projects
    .sort((a, b) => a.order - b.order)
    .map(
      (project, idx) => `
    <article class="project-card ${idx % 2 === 0 ? 'left' : 'right'}">
      <div class="project-content">
        <h3>${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="tech-tags">
          ${project.tech.map((t) => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="project-links">
          ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary">View Live</a>` : ''}
          ${project.repoUrl ? `<a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary">Repository</a>` : ''}
        </div>
      </div>
      ${
        project.screenshot
          ? `<div class="project-image-wrapper"><img src="${project.screenshot}" alt="${project.title}" class="project-image"></div>`
          : ''
      }
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #0f172a;
      background: #ffffff;
    }

    header {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, ${data.meta.colors.primary} 0%, ${data.meta.colors.accent} 100%);
      color: white;
      position: relative;
      overflow: hidden;
    }

    header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: drift 20s linear infinite;
    }

    @keyframes drift {
      0% { transform: translate(0, 0); }
      100% { transform: translate(50px, 50px); }
    }

    .header-content {
      position: relative;
      z-index: 1;
      text-align: center;
      max-width: 700px;
      padding: 2rem;
    }

    .profile-image {
      width: 150px;
      height: 150px;
      border-radius: 12px;
      margin: 0 auto 2rem;
      object-fit: cover;
      border: 5px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
    }

    header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 3.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
      letter-spacing: -1px;
    }

    header .title {
      font-size: 1.5rem;
      opacity: 0.95;
      margin-bottom: 1.5rem;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    header .bio {
      font-size: 1.1rem;
      opacity: 0.9;
      line-height: 1.8;
      margin-bottom: 2rem;
    }

    .contact-links {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .contact-links a {
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      border: 2px solid white;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s;
      backdrop-filter: blur(10px);
    }

    .contact-links a:hover {
      background: white;
      color: ${data.meta.colors.primary};
    }

    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 4rem 2rem;
    }

    section {
      margin-bottom: 4rem;
    }

    section h2 {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      margin-bottom: 2rem;
      color: ${data.meta.colors.primary};
      font-weight: 700;
    }

    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .skill-tag {
      background: ${data.meta.colors.primary};
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .skill-tag:hover {
      transform: scale(1.05);
    }

    .projects {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .project-card {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
      padding: 2rem;
      border-radius: 12px;
      border: 2px solid #e5e7eb;
      transition: all 0.3s;
    }

    .project-card.left .project-content {
      order: 1;
    }

    .project-card.left .project-image-wrapper {
      order: 2;
    }

    .project-card.right .project-content {
      order: 2;
    }

    .project-card.right .project-image-wrapper {
      order: 1;
    }

    .project-card:hover {
      border-color: ${data.meta.colors.primary};
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .project-content h3 {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      margin-bottom: 1rem;
      color: ${data.meta.colors.primary};
    }

    .project-description {
      font-size: 1rem;
      color: #475569;
      line-height: 1.8;
      margin-bottom: 1.5rem;
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .tag {
      background: ${data.meta.colors.accent};
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .project-links {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-primary {
      background: ${data.meta.colors.primary};
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
      display: inline-block;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    .btn-secondary {
      background: transparent;
      color: ${data.meta.colors.primary};
      padding: 0.75rem 1.5rem;
      border: 2px solid ${data.meta.colors.primary};
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
      display: inline-block;
    }

    .btn-secondary:hover {
      background: ${data.meta.colors.primary};
      color: white;
    }

    .project-image-wrapper {
      border-radius: 8px;
      overflow: hidden;
    }

    .project-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    footer {
      text-align: center;
      padding: 3rem 2rem;
      border-top: 2px solid #e5e7eb;
      color: #6b7280;
      font-size: 0.95rem;
    }

    @media (max-width: 768px) {
      header h1 {
        font-size: 2.5rem;
      }

      header .title {
        font-size: 1.25rem;
      }

      .project-card {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .project-card.left .project-content,
      .project-card.left .project-image-wrapper,
      .project-card.right .project-content,
      .project-card.right .project-image-wrapper {
        order: unset !important;
      }

      section h2 {
        font-size: 2rem;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="header-content">
      ${data.meta.profileImage ? `<img src="${data.meta.profileImage}" alt="${data.meta.name}" class="profile-image">` : ''}
      <h1>${data.meta.name}</h1>
      <p class="title">${data.meta.title}</p>
      <p class="bio">${data.meta.bio}</p>
      <div class="contact-links">
        ${contactHtml}
      </div>
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
      <h2>Featured Work</h2>
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

