export interface PersonalDetailsData {
  fullName: string;
  jobTitle: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio?: string; // Add this line (the '?' makes it optional)
}

export interface ExperienceData {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface EducationData {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  gpa: string;
}

export interface SkillCategoryData {
  id: string;
  category: string;
  items: string;
}

export interface ProjectData {
  id: string;
  name: string;
  techStack: string;
  description: string;
  link: string;
  aiFilled?: boolean;
}

export interface CertificationData {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
}
export interface AchievementData {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
}
export interface CustomSectionData {
  id: string;
  sectionTitle: string;
  content: string; 
}

export interface ResumeData {
  personal: PersonalDetailsData;
  summary: string;
  experience: ExperienceData[];
  education: EducationData[];
  skills: SkillCategoryData[];
  projects: ProjectData[];
  certifications: CertificationData[];
  achievements: AchievementData[]; // Added achievements to the ResumeData structure
  customSections: CustomSectionData[]; // Added custom sections to the ResumeData structure
}
