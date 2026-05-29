import { useState, useCallback } from 'react';
import type {
  ResumeData,
  PersonalDetailsData,
  ExperienceData,
  EducationData,
  SkillCategoryData,
  ProjectData,
  CertificationData,
  AchievementData,
  CustomSectionData, // 1. Imported the new type
} from '../types';

const initialPersonal = (): PersonalDetailsData => ({
  fullName: '',
  jobTitle: '',
  location: '',
  phone: '',
  email: '',
  linkedin: '',
  github: '',
  portfolio: '', // Added initializer for the portfolio website field
});

const initialExperience = (): ExperienceData => ({
  id: crypto.randomUUID(),
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  bullets: [''],
});

const initialEducation = (): EducationData => ({
  id: crypto.randomUUID(),
  institution: '',
  degree: '',
  field: '',
  startYear: '',
  endYear: '',
  gpa: '',
});

const initialSkill = (cat = '', items = ''): SkillCategoryData => ({
  id: crypto.randomUUID(),
  category: cat,
  items: items,
});

const initialProject = (): ProjectData => ({
  id: crypto.randomUUID(),
  name: '',
  techStack: '',
  description: '',
  link: '',
});

const initialCertification = (): CertificationData => ({
  id: crypto.randomUUID(),
  name: '',
  issuer: '',
  date: '',
  credentialId: '',
});

const initialAchievement = (): AchievementData => ({
  id: crypto.randomUUID(),
  title: '',
  organization: '',
  date: '',
  description: '',
});

// 2. Added initializer function for custom sections
const initialCustomSection = (): CustomSectionData => ({
  id: crypto.randomUUID(),
  sectionTitle: '',
  content: '',
});

export const useResumeData = () => {
  const [data, setData] = useState<ResumeData>(() => ({
    personal: initialPersonal(),
    summary: '',
    experience: [initialExperience()],
    education: [initialEducation()],
    skills: [
      initialSkill('Cloud Platforms', 'Microsoft Azure, Microsoft Fabric'),
      initialSkill('Data Engineering', 'Data Pipelines, Lakehouses, Dataflows Gen2, ETL/ELT'),
      initialSkill('Analytics & BI', 'Power BI Desktop, Power BI Service, DAX, Power Query'),
      initialSkill('Programming Languages', 'Java, Python, SQL'),
    ],
    projects: [initialProject()],
    certifications: [initialCertification()],
    achievements: [initialAchievement()],
    customSections: [], // 3. Initialized as an empty array (users can explicitly add them if needed)
  }));

  const updatePersonal = useCallback((field: keyof PersonalDetailsData, value: string) => {
    setData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  }, []);

  const updateSummary = useCallback((value: string) => {
    setData((prev) => ({
      ...prev,
      summary: value,
    }));
  }, []);

  // EXPERIENCE
  const addExperience = useCallback(() => {
    setData((prev) => ({
      ...prev,
      experience: [...prev.experience, initialExperience()],
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  }, []);

  const updateExperience = useCallback((id: string, field: keyof ExperienceData, value: any) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  }, []);

  // EDUCATION
  const addEducation = useCallback(() => {
    setData((prev) => ({
      ...prev,
      education: [...prev.education, initialEducation()],
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  }, []);

  const updateEducation = useCallback((id: string, field: keyof EducationData, value: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  }, []);

  // SKILLS
  const addSkill = useCallback(() => {
    setData((prev) => ({
      ...prev,
      skills: [...prev.skills, initialSkill()],
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }));
  }, []);

  const updateSkill = useCallback((id: string, field: keyof SkillCategoryData, value: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  }, []);

  // PROJECTS
  const addProject = useCallback(() => {
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, initialProject()],
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  }, []);

  const updateProject = useCallback((id: string, field: keyof ProjectData, value: any) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  }, []);

  // CERTIFICATIONS
  const addCertification = useCallback(() => {
    setData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, initialCertification()],
    }));
  }, []);

  const removeCertification = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }));
  }, []);

  const updateCertification = useCallback((id: string, field: keyof CertificationData, value: string) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }));
  }, []);

  // ACHIEVEMENTS
  const addAchievement = useCallback(() => {
    setData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, initialAchievement()],
    }));
  }, []);

  const removeAchievement = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((ach) => ach.id !== id),
    }));
  }, []);

  const updateAchievement = useCallback((id: string, field: keyof AchievementData, value: string) => {
    setData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((ach) =>
        ach.id === id ? { ...ach, [field]: value } : ach
      ),
    }));
  }, []);

  // 4. CUSTOM SECTIONS STATE HANDLERS
  const addCustomSection = useCallback(() => {
    setData((prev) => ({
      ...prev,
      customSections: [...prev.customSections, initialCustomSection()],
    }));
  }, []);

  const removeCustomSection = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((sec) => sec.id !== id),
    }));
  }, []);

  const updateCustomSection = useCallback((id: string, field: keyof CustomSectionData, value: string) => {
    setData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((sec) =>
        sec.id === id ? { ...sec, [field]: value } : sec
      ),
    }));
  }, []);

  return {
    data,
    updatePersonal,
    updateSummary,
    addExperience,
    removeExperience,
    updateExperience,
    addEducation,
    removeEducation,
    updateEducation,
    addSkill,
    removeSkill,
    updateSkill,
    addProject,
    removeProject,
    updateProject,
    addCertification,
    removeCertification,
    updateCertification,
    addAchievement,
    removeAchievement,
    updateAchievement,
    addCustomSection,       // 5. Exposed Custom Section Handlers
    removeCustomSection,
    updateCustomSection,
  };
};