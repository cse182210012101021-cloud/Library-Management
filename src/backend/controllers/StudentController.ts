import { StudentService } from "@/backend/services/StudentService";

export class StudentController {
  static async getStudent({ email }: { email: string | null }) {
    return StudentService.getStudent({ email });
  }
}
