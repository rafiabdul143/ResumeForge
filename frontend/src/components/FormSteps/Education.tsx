import React from 'react';
import type { EducationData } from '../../types';

interface EducationProps {
  education: EducationData[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: keyof EducationData, value: string) => void;
}

export const Education: React.FC<EducationProps> = ({
  education,
  onAdd,
  onRemove,
  onChange,
}) => {
  return (
    <section className="form-step">
      <div className="step-header">
        <div className="step-tag">STEP 04</div>
        <h1 className="step-title">Education</h1>
        <p className="step-sub">Add your academic background.</p>
      </div>

      <div id="educationList">
        {education.map((edu, index) => (
          <div className="repeatable-card" key={edu.id} id={edu.id}>
            <div className="card-header-row">
              <span className="card-label">Education #{index + 1}</span>
              <button
                className="btn-remove"
                type="button"
                onClick={() => onRemove(edu.id)}
              >
                ✕ Remove
              </button>
            </div>
            <div className="form-grid">
              <div className="field full">
                <label htmlFor={`${edu.id}_institution`}>Institution Name</label>
                <input
                  type="text"
                  id={`${edu.id}_institution`}
                  placeholder="e.g. Kakatiya Institute of Technology"
                  value={edu.institution}
                  onChange={(e) => onChange(edu.id, 'institution', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor={`${edu.id}_degree`}>Degree</label>
                <input
                  type="text"
                  id={`${edu.id}_degree`}
                  placeholder="e.g. Bachelor of Technology"
                  value={edu.degree}
                  onChange={(e) => onChange(edu.id, 'degree', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor={`${edu.id}_field`}>Field of Study</label>
                <input
                  type="text"
                  id={`${edu.id}_field`}
                  placeholder="e.g. Information Technology"
                  value={edu.field}
                  onChange={(e) => onChange(edu.id, 'field', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor={`${edu.id}_startYear`}>Start Year</label>
                <input
                  type="text"
                  id={`${edu.id}_startYear`}
                  placeholder="e.g. 2020"
                  value={edu.startYear}
                  onChange={(e) => onChange(edu.id, 'startYear', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor={`${edu.id}_endYear`}>End Year</label>
                <input
                  type="text"
                  id={`${edu.id}_endYear`}
                  placeholder="e.g. 2023"
                  value={edu.endYear}
                  onChange={(e) => onChange(edu.id, 'endYear', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor={`${edu.id}_gpa`}>GPA / CGPA (optional)</label>
                <input
                  type="text"
                  id={`${edu.id}_gpa`}
                  placeholder="e.g. 6.88 / 10"
                  value={edu.gpa}
                  onChange={(e) => onChange(edu.id, 'gpa', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="add-btn" type="button" onClick={onAdd}>
        <span>+</span> Add Education
      </button>
    </section>
  );
};
