export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type PersonalInfo = {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  experienceLevel: ExperienceLevel;
  avatar: string;
  actingGoals: string;
};