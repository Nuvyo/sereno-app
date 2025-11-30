export interface IUser {
  name: string;
  email: string;
  password: string;
  photo?: string;
  psychologist: boolean;
  public: boolean;
  crp: string;
  validCRP: boolean;
  specializations: Specialization[];
  whatsapp: string;
  sessionCost: number;
  bio: string;
}

export enum Specialization {
  Ansiety = 'anxiety',
  Depression = 'depression',
  Relationship = 'relationship',
  Trauma = 'trauma',
  ChildPsychology = 'child_psychology',
  Addiction = 'addiction',
  StressManagement = 'stress_management',
}
