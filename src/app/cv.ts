export interface CV {
  additionals:     Additional[];
  contact:         Contact;
  educations:      Education[];
  experiences:     Experience[];
  languages:       Language[];
  personal:        Personal;
  photo:           string;
  position:        Position;
  skill:           Skill;
  state:           State;
  trainings:       Training[];
  uiLanguage:      number;
  searchState:     number;
  updateDate:      Date;
  rtfLink:         string;
  viewLink:        string;
  resumeCount:     number;
  diiaCertificate: string;
  resumeId:        number;
}

export interface Additional {
  id:          number;
  title:       string;
  description: string;
  resumeId:    number;
}

export interface Contact {
  email:            string;
  isPhoneConfirmed: boolean;
  phone:            string;
  skype:            string;
  additionalPhones: any[];
  portfolio:        string[];
  socialNetworks:   SocialNetwork[];
  resumeId:         number;
}

export interface SocialNetwork {
  type:    number;
  subType: number;
  text:    string;
}

export interface Education {
  id:         number;
  typeId:     number;
  schoolName: string;
  location:   string;
  speciality: string;
  year:       number;
  diploma:    string;
  resumeId:   number;
}

export interface Experience {
  startWork:          Date;
  endWork:            Date;
  id:                 number;
  branchId:           number;
  notebookCompanyId:  number;
  position:           string;
  company:            string;
  description:        string;
  period:             string;
  recommendationList: any[];
  resumeId:           number;
}

export interface Language {
  languageId:         number;
  skillsLevel:        number;
  skillName:          string;
  languageName:       string;
  certificate:        string;
  isCanBeInterviewed: boolean;
  resumeId:           number;
}

export interface Personal {
  name:        string;
  middleName:  string;
  surName:     string;
  dateBirth:   Date;
  gender:      number;
  cityId:      number;
  moving:      number[];
  districtIds: number[];
  resumeId:    number;
}

export interface Position {
  position:    string;
  scheduleId:  number;
  scheduleIds: number[];
  salary:      number;
  currencyId:  number;
  rubrics:     Rubric[];
  resumeId:    number;
}

export interface Rubric {
  parentId:     number;
  experienceId: number;
  vacCount:     number;
  id:           number;
  ru:           null;
  ua:           null;
  en:           null;
}

export interface Skill {
  text:     string;
  resumeId: number;
}

export interface State {
  level:      number;
  anonymous:  boolean;
  branchIds:  any[];
  companyIds: number[];
  viewCount:  number;
  banReason:  any[];
  active:     boolean;
  isDeleted:  boolean;
  ukrainian:  null;
  resumeId:   number;
}

export interface Training {
  id:          number;
  name:        string;
  location:    string;
  description: string;
  year:        number;
  resumeId:    number;
}
