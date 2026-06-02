import React from 'react';
import type { ProjectData } from '../../types';

interface ProjectsProps {
  projects: ProjectData[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: keyof ProjectData, value: any) => void;
  onAIFill: (id: string, projectName: string) => Promise<void>;
}

export const Projects: React.FC<ProjectsProps> = ({
  projects,
  onAdd,
  onRemove,
  onChange,
  onAIFill,
}) => {
  const handleAIFillClick = async (id: string, name: string) => {
    if (!name.trim()) {
      alert('Please enter a project name first!');
      return;
    }
    await onAIFill(id, name);
  };

  return (
    <section className="form-step">
      <div className="step-header">
        <div className="step-tag">STEP 06</div>
        <h1 className="step-title">Projects</h1>
        <p className="step-sub">Showcase your work. Don't know the details? Enter the name and let AI fill it!</p>
      </div>

      <div id="projectsList">
        {projects.map((proj, index) => (
          <div className="repeatable-card" key={proj.id} id={proj.id}>
            <div className="card-header-row">
              <span className="card-label">Project #{index + 1}</span>
              <button
                className="btn-remove"
                type="button"
                onClick={() => onRemove(proj.id)}
              >
                ✕ Remove
              </button>
            </div>
            <div className="form-grid">
              <div className="field full">
                <div className="project-search-row">
                  <div className="field" style={{ flex: 1, gap: '6px', display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor={`${proj.id}_name`}>
                      Project Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id={`${proj.id}_name`}
                      placeholder="e.g. Restaurant Recommendation System"
                      value={proj.name}
                      onChange={(e) => onChange(proj.id, 'name', e.target.value)}
                    />
                  </div>
                  <button
                    className="btn-ai-search"
                    type="button"
                    onClick={() => handleAIFillClick(proj.id, proj.name)}
                  >
                    ✦ AI Fill
                  </button>
                </div>
                <p className="bullets-hint" style={{ marginTop: '6px' }}>
                  Don't know the details? Enter name and click <strong>AI Fill</strong>!
                </p>
              </div>

              <div className="field">
                <label htmlFor={`${proj.id}_techStack`}>Technologies Used</label>
                <input
                  type="text"
                  id={`${proj.id}_techStack`}
                  placeholder="e.g. Python, Flask, MySQL"
                  value={proj.techStack}
                  onChange={(e) => onChange(proj.id, 'techStack', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor={`${proj.id}_link`}>GitHub / Live Link (optional)</label>
                <input
                  type="url"
                  id={`${proj.id}_link`}
                  placeholder="https://github.com/yourname/project"
                  value={proj.link}
                  onChange={(e) => onChange(proj.id, 'link', e.target.value)}
                />
              </div>
              <div className="field full">
                <label htmlFor={`${proj.id}_description`}>Project Description</label>
                <textarea
                  id={`${proj.id}_description`}
                  rows={4}
                  placeholder="Describe what the project does, your role, and the impact..."
                  value={proj.description}
                  onChange={(e) => onChange(proj.id, 'description', e.target.value)}
                />
                {proj.aiFilled && (
                  <span className="ai-fill-badge" id={`${proj.id}_aibadge`}>
                    ✓ AI Filled
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="add-btn" type="button" onClick={onAdd}>
        <span>+</span> Add Project
      </button>
    </section>
  );
};
