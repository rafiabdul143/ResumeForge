import { useCallback, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  FileDown,
  Leaf,
  ExternalLink,
  Sparkles,
  Shield,
} from 'lucide-react';

import { StepNavigator } from './components/StepNavigator';
import { PersonalDetails } from './components/FormSteps/PersonalDetails';
import { ProfessionalSummary } from './components/FormSteps/ProfessionalSummary';
import { WorkExperience } from './components/FormSteps/WorkExperience';
import { Education } from './components/FormSteps/Education';
import { TechnicalSkills } from './components/FormSteps/TechnicalSkills';
import { Projects } from './components/FormSteps/Projects';
import { Certifications } from './components/FormSteps/Certifications';
import { Achievements } from './components/FormSteps/Achievements';
import { CustomSection } from './components/FormSteps/CustomSection';
import { ResumePreview } from './components/ResumePreview';

import { useResumeData } from './hooks/useResumeData';

const TOTAL_STEPS = 10;

export const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const resume = useResumeData();

  const isResumeEmpty = useCallback(() => {
    return (
      !resume.data.personal.fullName.trim() ||
      !resume.data.personal.email.trim()
    );
  }, [
    resume.data.personal.fullName,
    resume.data.personal.email,
  ]);

  const goToStep = useCallback(
    (stepNum: number) => {
      if (stepNum < 1 || stepNum > TOTAL_STEPS) return;

      if (stepNum > 1 && isResumeEmpty()) {
        alert(
          'Please fill out your Personal Details (Name and Email) before continuing!'
        );
        return;
      }

      setCurrentStep(stepNum);

      if (stepNum === TOTAL_STEPS) {
        setIsPreviewOpen(true);
      } else {
        setIsPreviewOpen(false);
      }

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    [isResumeEmpty]
  );

  const nextStep = useCallback(() => {
    goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  const prevStep = useCallback(() => {
    goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  const handleAIFill = useCallback(
    async (id: string, projectName: string) => {
      setIsAILoading(true);

      try {
        const response = await fetch('/api/ai/project-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectName,
          }),
        });

        if (!response.ok) {
          throw new Error('AI request failed');
        }

        const data = await response.json();

        resume.updateProject(
          id,
          'description',
          data.description || ''
        );

        resume.updateProject(
          id,
          'techStack',
          data.technologies || ''
        );

        resume.updateProject(id, 'aiFilled', true);
      } catch (error) {
        console.error('AI Fill failed:', error);

        window.alert(
          'AI Fill could not complete. Please make sure the backend is running on localhost:5258.'
        );
      } finally {
        setIsAILoading(false);
      }
    },
    [resume]
  );

  return (
    <div className="app-shell min-h-screen flex flex-col">
      
      {/* HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <div className="logo">
            <Leaf
              aria-hidden="true"
              className="logo-icon"
              size={22}
            />
            <span className="logo-text">ResumeForge</span>
          </div>

          <div className="header-badge">
            Free | ATS Optimized | Instant PDF
          </div>
        </div>
      </header>

      {/* STEP NAVIGATION */}
      <StepNavigator
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onGoToStep={goToStep}
      />

      {/* MAIN CONTENT */}
      <main className="app-container flex-1">

        {currentStep === 1 && (
          <PersonalDetails
            data={resume.data.personal}
            onChange={resume.updatePersonal}
          />
        )}

        {currentStep === 2 && (
          <ProfessionalSummary
            summary={resume.data.summary}
            onChange={resume.updateSummary}
          />
        )}

        {currentStep === 3 && (
          <WorkExperience
            experience={resume.data.experience}
            onAdd={resume.addExperience}
            onRemove={resume.removeExperience}
            onChange={resume.updateExperience}
          />
        )}

        {currentStep === 4 && (
          <Education
            education={resume.data.education}
            onAdd={resume.addEducation}
            onRemove={resume.removeEducation}
            onChange={resume.updateEducation}
          />
        )}

        {currentStep === 5 && (
          <TechnicalSkills
            skills={resume.data.skills}
            onAdd={resume.addSkill}
            onRemove={resume.removeSkill}
            onChange={resume.updateSkill}
          />
        )}

        {currentStep === 6 && (
          <Projects
            projects={resume.data.projects}
            onAdd={resume.addProject}
            onRemove={resume.removeProject}
            onChange={resume.updateProject}
            onAIFill={handleAIFill}
          />
        )}

        {currentStep === 7 && (
          <Certifications
            certifications={resume.data.certifications}
            onAdd={resume.addCertification}
            onRemove={resume.removeCertification}
            onChange={resume.updateCertification}
          />
        )}

        {currentStep === 8 && (
          <Achievements
            achievements={resume.data.achievements}
            onAdd={resume.addAchievement}
            onRemove={resume.removeAchievement}
            onChange={resume.updateAchievement}
          />
        )}

        {currentStep === 9 && (
          <CustomSection
            sections={resume.data.customSections}
            onAdd={resume.addCustomSection}
            onRemove={resume.removeCustomSection}
            onChange={resume.updateCustomSection}
          />
        )}

        {currentStep === TOTAL_STEPS && isPreviewOpen && (
          <ResumePreview
            data={resume.data}
            onEdit={() => goToStep(1)}
          />
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="nav-row">
          {currentStep > 1 && (
            <button
              className="btn-back"
              type="button"
              onClick={prevStep}
            >
              <ArrowLeft size={18} />
              Back
            </button>
          )}

          {currentStep < TOTAL_STEPS ? (
            <button
              className="btn-next"
              type="button"
              onClick={nextStep}
            >
              {currentStep === TOTAL_STEPS - 1
                ? 'Preview Resume'
                : 'Continue'}

              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              className="btn-next"
              type="button"
              onClick={() => window.print()}
            >
              <FileDown size={18} />
              Download PDF
            </button>
          )}
        </div>
      </main>

      
      {/* FOOTER */}
<footer className="rf-footer">
  <div className="rf-footer-inner">

    {/* BRAND COLUMN */}
    <div className="rf-footer-brand">

      <div className="rf-footer-logo">
        <div className="rf-footer-icon">
          <Leaf size={18} />
        </div>

        <span className="rf-footer-title">
          ResumeForge
        </span>
      </div>

      <p className="rf-footer-desc">
        A professional ATS-optimized resume builder designed
        for developers, engineers, graduates, and modern
        professionals.
      </p>

      <div className="rf-footer-dev">
        <p>
          Developed by
          <span> Muddungula</span>
        </p>

        <p>
          Re-developed by
          <span> Abdul Rafi</span>
        </p>
      </div>

      <a
        href="https://abdulrafi.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="rf-footer-link"
      >
        Portfolio
        <ExternalLink size={14} />
      </a>

    </div>

    {/* FEATURES COLUMN */}
    <div className="rf-footer-column">

      <h4 className="rf-footer-heading">
        Upcoming Features
      </h4>

      <ul className="rf-footer-list">
        <li>AI-Powered Resume Suggestions</li>
        <li>Multiple ATS Resume Templates</li>
        <li>GitHub & LinkedIn Integration</li>
        <li>Smart Skill Recommendations</li>
        <li>Cloud Resume Backup</li>
      </ul>

    </div>

    {/* SECURITY COLUMN */}
    <div className="rf-footer-column">

      <h4 className="rf-footer-heading">
        Privacy & Security
      </h4>

      <div className="rf-security-card">

        <p className="rf-security-title">
          100% Local Data Protection
        </p>

        <p className="rf-security-text">
          All resume information is securely processed within
          your browser environment without external storage.
        </p>

      </div>

    </div>

  </div>

  {/* FOOTER BOTTOM */}
  <div className="rf-footer-bottom">

    <p>
      © {new Date().getFullYear()} ResumeForge.
      All rights reserved.
    </p>

    <span>
      Secure Resume Architecture
    </span>

  </div>
</footer>
    </div>
  );
};

export default App;