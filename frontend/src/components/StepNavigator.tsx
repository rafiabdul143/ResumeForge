import { Check } from 'lucide-react';

interface StepNavigatorProps {
  currentStep: number;
  totalSteps: number;
  onGoToStep: (step: number) => void;
}

const steps = [
  { num: '01', label: 'Personal' },
  { num: '02', label: 'Summary' },
  { num: '03', label: 'Experience' },
  { num: '04', label: 'Education' },
  { num: '05', label: 'Skills' },
  { num: '06', label: 'Projects' },
  { num: '07', label: 'Certifications' },
  {num: '08', label: 'Achievements' },
  {num: '09', label: 'Custom Section' },
  { num: '10', label: 'Preview' },
];

export const StepNavigator = ({ currentStep, totalSteps, onGoToStep }: StepNavigatorProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <>
      <div className="progress-rail" aria-hidden="true">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }} />
      </div>

      <nav className="step-nav" aria-label="Resume builder steps">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;

          return (
            <button
              key={step.num}
              className={`step-pill ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              type="button"
              aria-current={isActive ? 'step' : undefined}
              onClick={() => onGoToStep(stepNum)}
            >
              {isCompleted ? (
                <Check aria-hidden="true" size={14} />
              ) : (
                <span className="step-num">{step.num}</span>
              )}
              <span className="step-label">{step.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
