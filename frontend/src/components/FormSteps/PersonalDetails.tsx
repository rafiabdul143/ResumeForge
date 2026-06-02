import React from 'react';
import type { PersonalDetailsData } from '../../types';

interface PersonalDetailsProps {
  data: PersonalDetailsData;
  onChange: (field: keyof PersonalDetailsData, value: string) => void;
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  data,
  onChange,
}) => {
  return (
    <section className="form-step">
      <div className="step-header">
        <div className="step-tag">STEP 01</div>
        <h1 className="step-title">Personal Details</h1>
        <p className="step-sub">Let's start with the basics. This forms the top section of your resume.</p>
      </div>

      <div className="repeatable-card">
        <div className="form-grid">
          {/* Full Name - Full Width */}
          <div className="field full">
            <label htmlFor="fullName">
              Full Name <span className="req">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="e.g. David Johnson"
              value={data.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
              required
            />
          </div>

          {/* Job Title & Location */}
          <div className="field">
            <label htmlFor="jobTitle">Job Title</label>
            <input
              type="text"
              id="jobTitle"
              placeholder="e.g. DevOps Engineer"
              value={data.jobTitle}
              onChange={(e) => onChange('jobTitle', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              placeholder="e.g. Hyderabad, Telangana"
              value={data.location}
              onChange={(e) => onChange('location', e.target.value)}
            />
          </div>

          {/* Contact Info */}
          <div className="field">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              placeholder="e.g. +91 6281447742"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="email">
              Email Address <span className="req">*</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="yourname@email.com"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
              required
            />
          </div>

          {/* Social & Professional Links */}
          <div className="field">
            <label htmlFor="linkedin">LinkedIn URL</label>
            <input
              type="url"
              id="linkedin"
              placeholder="linkedin.com/in/yourname"
              value={data.linkedin}
              onChange={(e) => onChange('linkedin', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="github">GitHub URL (Optional)</label>
            <input
              type="url"
              id="github"
              placeholder="github.com/yourname"
              value={data.github}
              onChange={(e) => onChange('github', e.target.value)}
            />
          </div>

          {/* New Portfolio Field - Optional */}
          <div className="field">
            <label htmlFor="portfolio">Portfolio Website (Optional)</label>
            <input
              type="url"
              id="portfolio"
              placeholder="e.g. yourportfolio.me"
              value={data.portfolio || ''} // Fallback to empty string
              onChange={(e) => onChange('portfolio', e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};