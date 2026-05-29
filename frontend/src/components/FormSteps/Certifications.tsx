import React from 'react';
import type { CertificationData } from '../../types';

interface CertificationsProps {
  certifications: CertificationData[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: keyof CertificationData, value: string) => void;
}

export const Certifications: React.FC<CertificationsProps> = ({
  certifications,
  onAdd,
  onRemove,
  onChange,
}) => {
  return (
    <section className="form-step">
      <div className="step-header">
        <div className="step-tag">STEP 07</div>
        <h1 className="step-title">Certifications</h1>
        <p className="step-sub">List professional certifications and achievements.</p>
      </div>

      <div id="certsList">
        {certifications.map((cert, index) => (
          <div className="repeatable-card" key={cert.id} id={cert.id}>
            <div className="card-header-row">
              <span className="card-label">Certification #{index + 1}</span>
              <button
                className="btn-remove"
                type="button"
                onClick={() => onRemove(cert.id)}
              >
                ✕ Remove
              </button>
            </div>
            <div className="form-grid">
              <div className="field full">
                <label htmlFor={`${cert.id}_name`}>Certification Name</label>
                <input
                  type="text"
                  id={`${cert.id}_name`}
                  placeholder="e.g. Microsoft Certified: Fabric Analytics Engineer Associate (DP-600)"
                  value={cert.name}
                  onChange={(e) => onChange(cert.id, 'name', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor={`${cert.id}_issuer`}>Issuing Organization / Issuer</label>
                <input
                  type="text"
                  id={`${cert.id}_issuer`}
                  placeholder="e.g. Microsoft"
                  value={cert.issuer}
                  onChange={(e) => onChange(cert.id, 'issuer', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor={`${cert.id}_date`}>Date Obtained</label>
                <input
                  type="text"
                  id={`${cert.id}_date`}
                  placeholder="e.g. 2024"
                  value={cert.date}
                  onChange={(e) => onChange(cert.id, 'date', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor={`${cert.id}_credentialId`}>Credential ID (optional)</label>
                <input
                  type="text"
                  id={`${cert.id}_credentialId`}
                  placeholder="e.g. F842-9921"
                  value={cert.credentialId}
                  onChange={(e) => onChange(cert.id, 'credentialId', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="add-btn" type="button" onClick={onAdd}>
        <span>+</span> Add Certification
      </button>
    </section>
  );
};
