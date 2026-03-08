import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";
import { MESSAGE } from "@/lib/message";
import Student from "@/model/Student";
import { jsonObject } from "@/utils/CommonUtils";
import { ApiError } from "@/wrapper/ApiError";

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
