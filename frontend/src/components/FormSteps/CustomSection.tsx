import React from 'react';
import type { CustomSectionData } from '../../types';

interface CustomSectionsProps {
  sections: CustomSectionData[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: keyof CustomSectionData, value: string) => void;
}

export const CustomSection: React.FC<CustomSectionsProps> = ({
  sections,
  onAdd,
  onRemove,
  onChange,
}) => {
  return (
    <section className="form-step">
     
     <div className="step-header">
  <div className="step-tag">STEP 09</div>
  <h1 className="step-title">
    Additional Sections <span className="optional-tag">(Optional)</span>
  </h1>
  <p className="step-sub">
    Add anything else like Languages, Volunteer Work, Open Source Contributions, or Interests.
  </p>
  
  {/* Professional Note for Recruiters */}
  <div className="step-tip-note">
    <strong>Recruiter Tip:</strong> Use this space to stand out! Adding targeted details like industry affiliations, or multilingual skills shows a well-rounded professional profile. If you don't need this, feel free to skip to the next step.
  </div>
</div>

      <div className="custom-sections-list">
        {sections.map((section, index) => (
          <div className="repeatable-card" key={section.id}>
            <div className="card-header-row">
              <span className="card-label">Custom Section #{index + 1}</span>
              <button className="btn-remove" type="button" onClick={() => onRemove(section.id)}>
                ✕ Remove
              </button>
            </div>
            
            <div className="form-grid">
              <div className="field full">
                <label>Section Title</label>
                <input
                  type="text"
                  placeholder="e.g. Languages / Volunteer Work / Memberships"
                  value={section.sectionTitle}
                  onChange={(e) => onChange(section.id, 'sectionTitle', e.target.value)}
                />
              </div>
              <div className="field full">
                <label>Content</label>
                <textarea
                  placeholder="Describe your details here..."
                  value={section.content}
                  onChange={(e) => onChange(section.id, 'content', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="add-btn" type="button" onClick={onAdd}>
        <span>+</span> Add Custom Section
      </button>
    </section>
  );
};