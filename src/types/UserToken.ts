export interface UserToken {
  userId: string;
  referenceId: string;
  userType: string;
  email?: string;
  iat: number;
  exp: number;
}
