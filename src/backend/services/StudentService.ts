import { HttpStatusCode } from "@/shared/constant/enum/HttpStatusCode";
import { MESSAGE } from "@/shared/lib/message";
import Student from "@/database/model/Student";
import { jsonObject } from "@/shared/utils/CommonUtils";
import { ApiError } from "@/frontend/wrapper/ApiError";

export class StudentService {
  static async getStudent({ email }: { email: string | null }) {
    const student = await Student.findOne({ email });

    if (!student) {
      throw new ApiError(
        MESSAGE.API.ERROR.STUDENT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    return jsonObject({ student });
  }
}
