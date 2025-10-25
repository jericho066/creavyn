import { useRef, useState, useEffect } from "react";
import { colorPalettes } from "../utils/colorPalettes";


export default function FormSection({ portfolio, onUpdate }) {
  const fileInputRef = useRef(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [collapsedProjects, setCollapsedProjects] = useState(new Set());
  const [skillsInput, setSkillsInput] = useState("");
  const [techInputs, setTechInputs] = useState({});

  useEffect(() => {
    setSkillsInput(portfolio.skills.join(', '));
  }, [portfolio.skills]);

  useEffect(() => {
    const initialTechInputs = {};
    portfolio.projects.forEach((project) => {
      initialTechInputs[project.id] = project.tech.join(', ');
    });
    setTechInputs(initialTechInputs);
  }, [portfolio.projects]);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onUpdate('meta', 'profileImage', event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSkillsChange = (value) => {
    const skills = value.split(',').map(s => s.trim()).filter(s => s);
    onUpdate('skills', null, skills);
  };


  // Drag and Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }

    handleDragMove(e);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }

    const updatedProjects = [...portfolio.projects];
    const [draggedProject] = updatedProjects.splice(draggedIndex, 1);
    updatedProjects.splice(dropIndex, 0, draggedProject);

    // Update order property
    const reorderedProjects = updatedProjects.map((project, idx) => ({
      ...project,
      order: idx
    }));

    onUpdate('projects', null, reorderedProjects);
    setDragOverIndex(null);
  };

  //* to atomatically scroll during drag
  const handleDragMove = (e) => {
    const scrollThreshold = 100;
    const scrollSpeed = 10;

    const formContainer = document.querySelector(".builder-form");
    if (!formContainer) return;

    const rect = formContainer.getBoundingClientRect();
    const mouseY = e.clientY;

    //* scroll up when near top
    if (mouseY - rect.top < scrollThreshold) {
      formContainer.scrollTop -= scrollSpeed;
    }

    //* scroll down when near bottom
    if (rect.bottom - mouseY < scrollThreshold) {
      formContainer.scrollTop += scrollSpeed;
    }
  }


  const handleDuplicateProject = (index) => {
    const projectToDuplicate = portfolio.projects[index];
    const duplicatedProject = {
      ...projectToDuplicate,
      id: Math.random().toString(36).substr(2, 9),
      title: `${projectToDuplicate.title} (Copy)`,
      order: portfolio.projects.length
    };
    
    onUpdate('projects', null, [...portfolio.projects, duplicatedProject]);
  };


  const toggleProjectCollapse = (projectId) => {
    setCollapsedProjects(prev => {
      const newSet = new Set(prev);
      if(newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    })
  }

  const isProjectCollapsed = (projectId) => {
    return collapsedProjects.has(projectId);
  }

  const collapseAll = () =>  {
    const allIds = portfolio.projects.map(p => p.id);
    setCollapsedProjects(new Set(allIds));
  }

  const expandAll = () => {
    setCollapsedProjects(new Set());
  }


  return (
    <form className="form-section">
      {/* Profile Section */}
      <div className="section-group">
        <h3>Profile</h3>
        
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={portfolio.meta.name}
            onChange={(e) => onUpdate('meta', 'name', e.target.value)}
            placeholder="Your Name"
          />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={portfolio.meta.title}
            onChange={(e) => onUpdate('meta', 'title', e.target.value)}
            placeholder="Frontend Developer"
          />
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Bio</label>
            <span
              className={`char-counter ${portfolio.meta.bio.length > 200 ? 'danger' :  portfolio.meta.bio.length > 150 ? 'warning' : 'good'}}`}
            >
              {portfolio.meta.bio.length} / 200
            </span>
          </div>

          <textarea
            value={portfolio.meta.bio}
            onChange={(e) => onUpdate('meta', 'bio', e.target.value)}
            placeholder="Short story about what you build..."
            rows="3"
            maxLength={250}
          />
          {portfolio.meta.bio.length > 200 && (
            <p className="char-hint warning">
              <i class="bi bi-exclamation-triangle"></i> Consider keeping your bio under 200 characters for better readability
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Profile Image</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
          />
          {portfolio.meta.profileImage && (
            <img 
              src={portfolio.meta.profileImage} 
              alt="Profile" 
              className="image-preview"
            />
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="section-group">
        <h3>Contact</h3>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={portfolio.contact.email}
            onChange={(e) => onUpdate('contact', 'email', e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>

        <div className="form-group">
          <label>GitHub</label>
          <input
            type="text"
            value={portfolio.contact.github}
            onChange={(e) => onUpdate('contact', 'github', e.target.value)}
            placeholder="https://github.com/username"
          />
        </div>

        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="text"
            value={portfolio.contact.linkedin}
            onChange={(e) => onUpdate('contact', 'linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div className="form-group">
          <label>Website</label>
          <input
            type="text"
            value={portfolio.contact.website}
            onChange={(e) => onUpdate('contact', 'website', e.target.value)}
            placeholder="https://example.com"
          />
        </div>
      </div>

      {/* Skills Section */}
      <div className="section-group">
        <h3>Skills</h3>
        
        <div className="form-group">
          <label>Skills (comma-separated)</label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            onBlur={(e) => handleSkillsChange(skillsInput)}
            placeholder="React, JavaScript, CSS, Node.js"
          />
        </div>
      </div>

      {/* Theme Section */}
      <div className="section-group">
          <h3>Theme Customization</h3>

          {/* Color Palette Suggestions */}
          <div className="color-palettes-section">
            <label style={{ marginBottom: '0.75rem', display: 'block' }}>
              <i className="bi bi-palette"></i> Quick Color Palettes
            </label>

            <div className="color-palettes-grid">
              {colorPalettes.map((palette) => (
                <button
                  key={palette.id}
                  type="button"
                  className="palette-card"
                  onClick={() => {
                    onUpdate("meta", "colors", {
                      primary: palette.primary,
                      accent: palette.accent
                    })
                  }}
                  title={`${palette.name} - ${palette.description}`}
                >
                  <div
                   className="palette-preview"
                   style={{ background: palette.preview }}
                  />

                  <div className="palette-info">
                    <span className="palette-name">{palette.name}</span>
                    <span className="palette-desc">{palette.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{
            borderTop: "1px solid #e2e8f0",
            marginTop: "1.5rem",
            paddingTop: "1.5rem"
          }}>
            <label style={{ marginBottom: "0.75rem", display: "block" }}>
              <i className="bi bi-sliders"></i> Custom Colors
            </label>
          </div>

          <div className="form-group">
            <label>Primary Color</label>
            
            <div className="color-picker-group">
              <input 
                type="color"
                value={portfolio.meta.colors.primary}
                onChange={(e) => {
                  onUpdate("meta", "colors", {
                    ...portfolio.meta.colors,
                    primary: e.target.value
                  })
                }} 
              />

              <input 
                type="text" 
                value={portfolio.meta.colors.primary}
                onChange={(e) => {
                  onUpdate("meta", "colors", {
                    ...portfolio.meta.colors,
                    primary: e.target.value
                  })
                }}
                placeholder="#2563eb"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Accent Color</label>
            
            <div className="color-picker-group">
                <input
                  type="color" 
                  value={portfolio.meta.colors.accent}
                  onChange={(e) => {
                    onUpdate("meta", "colors", {
                      ...portfolio.meta.colors,
                      accent: e.target.value
                    })
                  }}
                />

                <input
                  type="text"
                  value={portfolio.meta.colors.accent}
                  onChange={(e) => {
                    onUpdate('meta', 'colors', {
                      ...portfolio.meta.colors,
                      accent: e.target.value
                    });
                  }}
                  placeholder="#10b981"
                />
            </div>
          </div>

          <div className="form-group">
            <label>Template</label>
            <select
              value={portfolio.meta.theme}
              onChange={(e) => onUpdate('meta', 'theme', e.target.value)}
              className="theme-select"
            >
              <option value="minimal">Minimal</option>
              <option value="bold">Bold</option>
            </select>
          </div>

      </div>

      {/* Project Section */}
      <div className="section-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ marginBottom: 0 }}>Project</h3>

            {portfolio.projects.length > 2 && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="btn-collapse-all"
                  title="Collapse all projects"
                >
                  <i className="bi bi-dash-square"></i> Collapse All
                </button>

                <button
                  type="button"
                  onClick={expandAll}
                  className="btn-expand-all"
                  title="Expand all projects"
                >
                  <i className="bi bi-plus-square"></i> Expand All
                </button>
              </div>
            )}
          </div>

          {portfolio.projects.length > 1 && (
            <p style={{
              fontSize: '0.85rem',
              color: '#64748b',
              marginBottom: '1rem',
              padding: '0.75rem',
              background: '#f0f9ff',
              borderRadius: '6px',
              borderLeft: '3px solid #3b82f6'
            }}>
              <i className="bi bi-lightbulb"></i>
              <strong> Tip:</strong> Drag projects to reorder them
            </p>
          )}


          <button
            type="button"
            onClick={() => onUpdate("projects", null, [...portfolio.projects, {
              id: Math.random().toString(36).substr(2, 9),
              title: 'New Project',
              description: '',
              tech: [],
              liveUrl: '',
              repoUrl: '',
              screenshot: null,
              order: portfolio.projects.length
            }])}
            className="btn-add-project"
          >
            + Add Project
          </button>

          <div className="projects-list">
            {portfolio.projects.map((project, idx) => (
              <div 
                key={project.id} 
                className={`project-item ${dragOverIndex === idx ? 'drag-over' : ''} ${isProjectCollapsed(project.id) ? 'collapsed' : ''}`}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx)}
                style={{
                  cursor: 'grab',
                  transition: 'all 0.2s ease'
                }}
              >

                <div className="collapse-delete-container">
                  <button
                    type="button"
                    className="btn-collapse-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleProjectCollapse(project.id);
                    }}
                    title={isProjectCollapsed(project.id) ? "Expand" : "Collapse"}
                  >
                    <i className={`bi ${isProjectCollapsed(project.id) ? 'bi-chevron-right' : 'bi-chevron-down'}`}></i>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = portfolio.projects.filter((_, i) => i !== idx);
                      onUpdate("projects", null, updated);
                    }}
                    className="btn-delete-project"
                  >
                    ✕
                  </button>
                </div>


                <div 
                  className="project-header"
                  onClick={(e) => {
                    //* to not allow to collapse when clicking on inputs or buttons
                    if(!e.target.closest("input, button")) {
                      toggleProjectCollapse(project.id);
                    } 
                  }}
                  style={{ cursor: "pointer" }}
                >


                  <span 
                    className="project-number drag-handle" 
                    title="Drag to reorder"
                    style={{
                      cursor: 'grab',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}
                  >
                    ⋮⋮
                  </span>

                    <button
                      type="button"
                      onClick={() => handleDuplicateProject(idx)}
                      className="btn-duplicate-project"
                      title="Duplicate project"
                    >
                      <i className="bi bi-clipboard"></i>
                    </button>


                  <input 
                    type="text"
                    value={project.title}
                    onChange={(e) => {
                      const updated = [...portfolio.projects];
                      updated[idx].title = e.target.value;
                      onUpdate("projects", null, updated);
                    }}
                    placeholder="Project Title"
                    className="project-title-input"
                  />



                  

                  
                </div>


                {!isProjectCollapsed(project.id) && (
                  <>
                    <div className="form-group">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <label>Description</label>
                        <span
                          className={`char-counter ${project.description.length > 200 ? 'danger' : project.description.length > 120 ? 'warning' : 'good'}`}
                        >
                          {project.description.length} / 200
                        </span>

                      </div>

                      <textarea 
                        value={project.description}
                        onChange={(e) => {
                          const updated = [...portfolio.projects];
                          updated[idx].description = e.target.value;
                          onUpdate("projects", null, updated);
                        }}

                        placeholder="Problem → Role → Outcome (2-3 sentences)"
                        rows={2}
                        maxLength={250}
                      />
                      {project.description.length > 150 && (
                        <p className="char-hint warning">
                          <i class="bi bi-exclamation-triangle"></i> Keep descriptions concise for better impact
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Tech (comma-separated)</label>
                      <input
                        type="text"
                        value={techInputs[project.id] || ""}
                        onChange={(e) => {
                          setTechInputs(prev => ({
                            ...prev,
                            [project.id]: e.target.value
                          }))
                        }}
                        onBlur={(e) => {
                          const updated = [...portfolio.projects];
                          updated[idx].tech = e.target.value.split(",").map(t => t.trim()).filter(t => t);
                          onUpdate("projects", null, updated);
                        }}
                        placeholder="React, JavaScript, CSS"
                      />
                    </div>

                    <div className="form-group">
                      <label>Live URL</label>
                      <input
                        type="text"
                        value={project.liveUrl}
                        onChange={(e) => {
                          const updated = [...portfolio.projects];
                          updated[idx].liveUrl = e.target.value;
                          onUpdate('projects', null, updated);
                        }}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label>Repository URL</label>
                      <input
                        type="text"
                        value={project.repoUrl}
                        onChange={(e) => {
                          const updated = [...portfolio.projects];
                          updated[idx].repoUrl = e.target.value;
                          onUpdate('projects', null, updated);
                        }}
                        placeholder="https://github.com/username/project"
                      />
                    </div>

                    <div className="form-group">
                        <label>Screenshot</label>
                        <input 
                          type="file" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const updated = [...portfolio.projects];
                              updated[idx].screenshot = event.target.result;
                              onUpdate('projects', null, updated);
                            };
                            reader.readAsDataURL(file);
                          }}
                          accept="image/*"
                        />
                        {project.screenshot && (
                          <img 
                            src={project.screenshot}
                            alt={project.title} 
                            className="project-screenshot-preview"
                          />
                        )}
                    </div>

                  </>
                )}

              </div>
            ))}
          </div>
      </div>
    </form>
  );
}


