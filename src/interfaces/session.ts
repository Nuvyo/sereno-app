export interface ISession {
  createdAt: Date;
  expiresAt: Date;
  id: string;
  maxAge: number;
  token: string;
  updatedAt: string;
  userId: string;
}
