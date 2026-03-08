import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";
import { MESSAGE } from "@/lib/message";
import Member from "@/model/Member";
import Student from "@/model/Student";
import { jsonObject } from "@/utils/CommonUtils";
import { ApiError } from "@/wrapper/ApiError";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  static async signUp({
    email,
    password,
    userType,
  }: {
    email: string;
    password: string;
    userType?: string;
  }) {
    const [student, member] = await Promise.all([
      Student.findOne({ email }),
      Member.findOne({ email }),
    ]);

    if (!student) {
      throw new ApiError(
        MESSAGE.API.ERROR.STUDENT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    if (member) {
      throw new ApiError(
        MESSAGE.API.ERROR.MEMBER_ALREADY_EXIST,
        HttpStatusCode.CONFLICT,
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newMember = await Member.create({
      email,
      password: hashedPassword,
      userType,
      referenceId: student._id,
    });

    return jsonObject({
      email: newMember.email,
      userType: newMember.userType,
    });
  }

  static async logIn({ email, password }: { email: string; password: string }) {
    const member = await Member.findOne({ email: email });
    if (!member) {
      throw new ApiError(
        MESSAGE.API.ERROR.ACCOUNT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const isValid = await bcryptjs.compare(password, member.password);
    if (!isValid) {
      throw new ApiError(
        MESSAGE.API.ERROR.WRONG_PASSWORD,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const payload = {
      userId: member?._id.toString(),
      referenceId: member?.referenceId?.toString() || null,
      userType: member?.userType,
      email: member?.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    return {
      data: {
        ...payload,
      },
      token,
    };
  }
}
