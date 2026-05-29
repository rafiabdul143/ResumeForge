import { Lightbulb } from 'lucide-react';

interface ProfessionalSummaryProps {
  summary: string;
  onChange: (value: string) => void;
}

export const ProfessionalSummary = ({ summary, onChange }: ProfessionalSummaryProps) => (
  <section className="form-step">
    <div className="step-header">
      <div className="step-tag">STEP 02</div>
      <h1 className="step-title">Professional Summary</h1>
      <p className="step-sub">A 3-4 line snapshot of who you are. This is the first thing recruiters read.</p>
    </div>

    <div className="repeatable-card">
      <div className="form-grid">
        <div className="field full">
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            rows={6}
            maxLength={600}
            placeholder="Write a concise profile with your role, strengths, tools, and measurable impact."
            value={summary}
            onChange={(event) => onChange(event.target.value)}
          />
          <div className="char-count" aria-live="polite">
            {summary.length} / 600 characters
          </div>
        </div>
        <div className="field full">
          <div className="ai-hint-box">
            <Lightbulb className="ai-icon" aria-hidden="true" size={20} />
            <p>Include years of experience, core tools, and one concrete outcome. Keep it crisp for ATS scanning.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
