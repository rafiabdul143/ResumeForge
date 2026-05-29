import React from 'react';
export interface AchievementData {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
}
interface AchievementsProps {
  achievements: AchievementData[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: keyof AchievementData, value: string) => void;
}

export const Achievements: React.FC<AchievementsProps> = ({
  achievements,
  onAdd,
  onRemove,
  onChange,
}) => {
  return (
    <section className="form-step">
      <div className="step-header">
        <div className="step-tag">STEP 08</div>
        <h1 className="step-title">Honors and Achievements</h1>
        <p className="step-sub">Showcase awards, recognition, and professional milestones.</p>
      </div>

      <div id="achievementsList">
        {achievements.map((ach, index) => (
          <div className="repeatable-card" key={ach.id} id={ach.id}>
            <div className="card-header-row">
              <span className="card-label">Achievement #{index + 1}</span>
              <button
                className="btn-remove"
                type="button"
                onClick={() => onRemove(ach.id)}
              >
                ✕ Remove
              </button>
            </div>

            <div className="form-grid">
              <div className="field full">
                <label htmlFor={`${ach.id}_title`}>Achievement Title</label>
                <input
                  type="text"
                  id={`${ach.id}_title`}
                  placeholder="e.g. Employee of the Year / Hackathon Winner"
                  value={ach.title}
                  onChange={(e) => onChange(ach.id, 'title', e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor={`${ach.id}_org`}>Issuing Organization</label>
                <input
                  type="text"
                  id={`${ach.id}_org`}
                  placeholder="e.g. Microsoft / Forbes / Previous Company"
                  value={ach.organization}
                  onChange={(e) => onChange(ach.id, 'organization', e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor={`${ach.id}_date`}>Date Received</label>
                <input
                  type="text"
                  id={`${ach.id}_date`}
                  placeholder="e.g. 2023"
                  value={ach.date}
                  onChange={(e) => onChange(ach.id, 'date', e.target.value)}
                />
              </div>

              <div className="field full">
                <label htmlFor={`${ach.id}_desc`}>Description (optional)</label>
                <textarea
                  id={`${ach.id}_desc`}
                  placeholder="Describe the achievement and your specific contribution..."
                  value={ach.description}
                  onChange={(e) => onChange(ach.id, 'description', e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="add-btn" type="button" onClick={onAdd}>
        <span>+</span> Add Achievement
      </button>
    </section>
  );
};