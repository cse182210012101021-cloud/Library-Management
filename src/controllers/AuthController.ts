import { AuthService } from "@/services/AuthService";

export class AuthController {
  static async signUp({
    email,
    password,
    userType,
  }: {
    email: string;
    password: string;
    userType?: string;
  }) {
    return AuthService.signUp({ email, password, userType });
  }

  static async logIn({ email, password }: { email: string; password: string }) {
    return AuthService.logIn({ email, password });
  }
}
