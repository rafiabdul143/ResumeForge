import { FileDown, Pencil } from 'lucide-react';
import type { ResumeData } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
  onEdit: () => void;
}

const cleanUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/^www\./, '');

const filled = (value: string) => value ? value.trim().length > 0 : false;

export const ResumePreview = ({ data, onEdit }: ResumePreviewProps) => {
  const { 
    personal, 
    summary, 
    experience, 
    education, 
    skills, 
    projects, 
    certifications, 
    achievements, 
    customSections 
  } = data;

  const contactParts = [
    personal.location,
    personal.phone,
    personal.email,
    personal.linkedin ? cleanUrl(personal.linkedin) : '',
    personal.github ? cleanUrl(personal.github) : '',
  ].filter(filled);

  return (
    <section className="form-step" id="step8">
      <div className="step-header">
        <div className="step-tag">STEP 10</div>
        <h1 className="step-title">Preview & Download</h1>
        <p className="step-sub">Review the print-ready ATS resume, then download it as a PDF.</p>
      </div>

      <div className="preview-actions">
        <button className="btn-primary" type="button" onClick={() => window.print()}>
          <FileDown aria-hidden="true" size={18} />
          Download PDF
        </button>
        <button className="btn-outline" type="button" onClick={onEdit}>
          <Pencil aria-hidden="true" size={18} />
          Edit Resume
        </button>
      </div>

      <article className="resume-preview" aria-label="Resume preview">
        <div className="rv-name">{personal.fullName || 'Your Name'}</div>
        {personal.jobTitle && <div className="rv-job-title">{personal.jobTitle}</div>}
        {contactParts.length > 0 && <div className="rv-contact">{contactParts.join(' | ')}</div>}

        {/* PROFESSIONAL SUMMARY */}
        {summary && (
          <>
            <div className="rv-section">Professional Summary</div>
            <p className="rv-summary">{summary}</p>
          </>
        )}

        {/* WORK EXPERIENCE */}
        {experience.some((item) => filled(item.company) || filled(item.role)) && (
          <>
            <div className="rv-section">Work Experience</div>
            {experience.map((item) => {
              const bullets = item.bullets.map((bullet) => bullet.trim()).filter(Boolean);

              return (
                <div className="rv-entry" key={item.id}>
                  <div className="rv-entry-header">
                    <div>
                      {item.company && <div className="rv-company">{item.company}</div>}
                      {item.role && <div className="rv-role">{item.role}</div>}
                    </div>
                    <div className="rv-dates">
                      {[item.startDate, item.isCurrent ? 'Present' : item.endDate].filter(filled).join(' - ')}
                    </div>
                  </div>
                  {bullets.length > 0 && (
                    <ul className="rv-bullets">
                      {bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* EDUCATION */}
        {education.some((item) => filled(item.institution) || filled(item.degree)) && (
          <>
            <div className="rv-section">Education</div>
            {education.map((item) => (
              <div className="rv-entry" key={item.id}>
                <div className="rv-entry-header">
                  <div>
                    {item.institution && <div className="rv-company">{item.institution}</div>}
                    {(item.degree || item.field) && (
                      <div className="rv-degree">{[item.degree, item.field].filter(filled).join(', ')}</div>
                    )}
                    {item.gpa && <div className="rv-summary">GPA: {item.gpa}</div>}
                  </div>
                  <div className="rv-dates">{[item.startYear, item.endYear].filter(filled).join(' - ')}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* TECHNICAL SKILLS */}
        {skills.some((item) => filled(item.category) || filled(item.items)) && (
          <>
            <div className="rv-section">Skills</div>
            {skills.map((item) => (
              <div className="rv-skills-row" key={item.id}>
                <strong>{item.category || 'Skills'}:</strong> {item.items}
              </div>
            ))}
          </>
        )}

        {/* PROJECTS */}
        {projects.some((item) => filled(item.name) || filled(item.description)) && (
          <>
            <div className="rv-section">Projects</div>
            {projects.map((item) => (
              <div className="rv-entry" key={item.id}>
                <div className="rv-entry-header">
                  <div className="rv-project-name">{item.name}</div>
                  {item.link && <div className="rv-dates">{cleanUrl(item.link)}</div>}
                </div>
                {item.techStack && <div className="rv-project-tech">Technologies: {item.techStack}</div>}
                {item.description && <div className="rv-project-desc">{item.description}</div>}
              </div>
            ))}
          </>
        )}

        {/* CERTIFICATIONS */}
        {certifications.some((item) => filled(item.name) || filled(item.issuer)) && (
          <>
            <div className="rv-section">Certifications</div>
            {certifications.map((item) => (
              <div className="rv-cert-item" key={item.id}>
                {[item.name, item.issuer, item.date, item.credentialId].filter(filled).join(' | ')}
              </div>
            ))}
          </>
        )}

        {/* ACHIEVEMENTS */}
        {achievements && achievements.some((item) => filled(item.title) || filled(item.description)) && (
          <>
            <div className="rv-section">Achievements</div>
            {achievements.map((item) => (
              <div className="rv-entry" key={item.id}>
                <div className="rv-entry-header">
                  <div className="rv-project-name">{item.title}</div>
                  {item.date && <div className="rv-dates">{item.date}</div>}
                </div>
                {item.description && <div className="rv-project-desc">{item.description}</div>}
              </div>
            ))}
          </>
        )}

        {/* CUSTOM SECTIONS */}
    {/* CUSTOM SECTIONS */}
{customSections &&
  customSections.some(
    (section) =>
      filled(section.sectionTitle) ||
      filled(section.content)
  ) && (
    <>
      {customSections.map((section) => {
        if (
          !filled(section.sectionTitle) &&
          !filled(section.content)
        )
          return null;

        return (
          <div key={section.id}>
            <div className="rv-section">
              {section.sectionTitle || 'Additional Information'}
            </div>

            {section.content && (
              <p className="rv-summary whitespace-pre-line">
                {section.content}
              </p>
            )}
          </div>
        );
      })}
    </>
)}

      </article>
    </section>
  );
};