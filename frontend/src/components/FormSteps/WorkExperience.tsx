import { Plus, Trash2 } from 'lucide-react';
import type { ExperienceData } from '../../types';

interface WorkExperienceProps {
  experience: ExperienceData[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: keyof ExperienceData, value: string | boolean | string[]) => void;
}

export const WorkExperience = ({ experience, onAdd, onRemove, onChange }: WorkExperienceProps) => {
  const handleCurrentChange = (id: string, checked: boolean) => {
    onChange(id, 'isCurrent', checked);
    if (checked) {
      onChange(id, 'endDate', '');
    }
  };

  return (
    <section className="form-step">
      <div className="step-header">
        <div className="step-tag">STEP 03</div>
        <h1 className="step-title">Work Experience</h1>
        <p className="step-sub">Add roles in reverse chronological order, with one achievement per line.</p>
      </div>

      {experience.map((item, index) => (
        <div className="repeatable-card" key={item.id}>
          <div className="card-header-row">
            <span className="card-label">Experience #{index + 1}</span>
            <button className="btn-remove" type="button" onClick={() => onRemove(item.id)}>
              <Trash2 aria-hidden="true" size={14} />
              Remove
            </button>
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor={`${item.id}_company`}>Company</label>
              <input
                id={`${item.id}_company`}
                type="text"
                value={item.company}
                onChange={(event) => onChange(item.id, 'company', event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor={`${item.id}_role`}>Role</label>
              <input
                id={`${item.id}_role`}
                type="text"
                value={item.role}
                onChange={(event) => onChange(item.id, 'role', event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor={`${item.id}_startDate`}>Start Date</label>
              <input
                id={`${item.id}_startDate`}
                type="text"
                placeholder="Jan 2024"
                value={item.startDate}
                onChange={(event) => onChange(item.id, 'startDate', event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor={`${item.id}_endDate`}>End Date</label>
              <input
                id={`${item.id}_endDate`}
                type="text"
                placeholder="Present"
                value={item.endDate}
                disabled={item.isCurrent}
                onChange={(event) => onChange(item.id, 'endDate', event.target.value)}
              />
            </div>
            <div className="field full checkbox-field">
              <input
                id={`${item.id}_isCurrent`}
                type="checkbox"
                checked={item.isCurrent}
                onChange={(event) => handleCurrentChange(item.id, event.target.checked)}
              />
              <label htmlFor={`${item.id}_isCurrent`}>Currently working here</label>
            </div>
            <div className="field full">
              <label htmlFor={`${item.id}_bullets`}>Bullets</label>
              <textarea
                id={`${item.id}_bullets`}
                rows={5}
                placeholder="Improved reporting speed by 35% through optimized data models."
                value={item.bullets.join('\n')}
                onChange={(event) => onChange(item.id, 'bullets', event.target.value.split('\n'))}
              />
              <p className="bullets-hint">One bullet per line.</p>
            </div>
          </div>
        </div>
      ))}

      <button className="add-btn" type="button" onClick={onAdd}>
        <Plus aria-hidden="true" size={18} />
        Add Experience
      </button>
    </section>
  );
};
