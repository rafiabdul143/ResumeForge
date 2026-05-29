import React from 'react';
import type { SkillCategoryData } from '../../types';

interface TechnicalSkillsProps {
  skills: SkillCategoryData[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: keyof SkillCategoryData, value: string) => void;
}

export const TechnicalSkills: React.FC<TechnicalSkillsProps> = ({
  skills,
  onAdd,
  onRemove,
  onChange,
}) => {
  return (
    <section className="form-step">
      <div className="step-header">
        <div className="step-tag">STEP 05</div>
        <h1 className="step-title">Technical Skills</h1>
        <p className="step-sub">Organize your skills by category for maximum ATS impact.</p>
      </div>

      <div id="skillsList">
        {skills.map((skill) => {
          // Split values by comma for dynamic chip visualization
          const chips = skill.items
            ? skill.items.split(',').map((s) => s.trim()).filter(Boolean)
            : [];

          return (
            <div className="repeatable-card" key={skill.id} id={skill.id}>
              <div className="card-header-row">
                <span className="card-label">Skill Category</span>
                <button
                  className="btn-remove"
                  type="button"
                  onClick={() => onRemove(skill.id)}
                >
                  ✕ Remove
                </button>
              </div>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor={`${skill.id}_category`}>Category Name</label>
                  <input
                    type="text"
                    id={`${skill.id}_category`}
                    placeholder="e.g. Cloud Platforms"
                    value={skill.category}
                    onChange={(e) => onChange(skill.id, 'category', e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor={`${skill.id}_items`}>Skills (comma separated)</label>
                  <input
                    type="text"
                    id={`${skill.id}_items`}
                    placeholder="e.g. AWS, Azure, GCP"
                    value={skill.items}
                    onChange={(e) => onChange(skill.id, 'items', e.target.value)}
                  />
                  {chips.length > 0 && (
                    <div className="chips-container">
                      {chips.map((chip, index) => (
                        <span className="skill-chip" key={index}>
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="add-btn" type="button" onClick={onAdd}>
        <span>+</span> Add Skill Category
      </button>
    </section>
  );
};
