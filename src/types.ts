export type TabType = 'home' | 'research' | 'awards' | 'contact' | 'notes' | 'admin';

export type ProfileModalTab = 'photo' | 'cv' | 'bio' | 'education' | 'interests' | 'toolkit' | 'skills' | 'social';

export interface NotePost {
  id: string;
  slug: string;
  title: string;
  date: string;
  publishedAt?: string;
  category: string;
  tags: string[];
  excerpt: string;
  readingTime: string;
  coverImage?: string;
  content: string;
  featured?: boolean;
  order?: number;
}

export interface QuantitativeTool {
  name: string;
  desc: string;
  icon: string;
}

export interface SkillItem {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface SocialLink {
  name: string;
  handle: string;
  url: string;
  icon: string;
  desc: string;
}

export interface EducationEntry {
  id?: string;
  degree: string;
  institution: string;
  period: string;
  location?: string;
  gpa?: string;
  focus?: string;
  thesis?: string;
  honors?: string;
  coursework?: string;
  description?: string;
}

export interface EducationInfo {
  degree: string;
  institution: string;
  period: string;
  location?: string;
  gpa: string;
  focus: string;
  thesis?: string;
  honors?: string;
  coursework?: string;
  description?: string;
  entries?: EducationEntry[];
}

export interface CvDocument {
  fileData?: string; // Base64 data URL or remote file URL
  fileName?: string;
  fileType?: 'pdf' | 'docx' | 'doc' | string;
  fileSize?: string;
  uploadedAt?: string;
  fileUrl?: string;
}

export interface PersonalInfo {
  name: string;
  shortName: string;
  title: string;
  affiliation: string;
  email: string;
  location: string;
  avatarUrl: string;
  bio: string;
  bioSecondary?: string;
  education: EducationInfo;
  researchInterests: string[];
  quantitativeToolkit: QuantitativeTool[];
  skills: SkillItem[];
  socialLinks: SocialLink[];
  cvDocument?: CvDocument;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  year: string;
  status: 'published' | 'under_review' | 'working_paper';
  journalOrVenue?: string;
  abstract: string;
  description: string;
  tags: string[];
  doi?: string;
  pdfUrl?: string;
  methodology?: string;
  dataset?: string;
  keyFindings?: string[];
  bibtex?: string;
  order?: number;
}

export interface ResearchExperience {
  id: string;
  period: string;
  title: string;
  supervisorOrRole: string;
  institution?: string;
  description?: string;
  icon: string;
  tags?: string[];
  order?: number;
}

export interface AwardItem {
  id: string;
  title: string;
  organization?: string;
  description: string;
  category: 'conference' | 'award' | 'course';
  tag: string;
  secondaryTag?: string;
  icon: string;
  iconFilled?: boolean;
  year?: string;
  order?: number;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  category: 'research' | 'teaching' | 'leadership' | 'fellowship';
  description: string[];
  skills: string[];
  icon: string;
  order?: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  purpose: string;
  subject?: string;
  message: string;
  createdAt: string;
  read?: boolean;
}
