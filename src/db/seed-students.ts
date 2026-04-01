import bcrypt from "bcryptjs";
import Student from "@/model/Student";
import Member from "@/model/Member";
import { sampleStudents } from "@/deafult-data/student-list";
import { UserType } from "@/constant/enum/UserType";

export async function seedStudents() {
  try {
    // 1. Emergency fix for Tahsin and Deposree passwords (must run before early returns)
    const tahsinEmail = "cse_182210012101021@lus.ac.bd";
    const tahsinHashed = await bcrypt.hash("u123467$", 10);
    await Member.findOneAndUpdate({ email: tahsinEmail }, { $set: { password: tahsinHashed } });

    const deposreeEmail = "cse_182210012101049@lus.ac.bd";
    const deposreeHashed = await bcrypt.hash("Dep123@$", 10);
    await Member.findOneAndUpdate({ email: deposreeEmail }, { $set: { password: deposreeHashed } });

    const hashedPassword = await bcrypt.hash("123456", 10); // Default password for new students

    // 2. Cleanup: If we previously seeded up to 200, remove 101-200.
    for (let i = 101; i <= 200; i++) {
      const suffix = i.toString().padStart(4, "0");
      const studentId = `018221001210${suffix}`;
      const email = `student_${suffix}@lus.ac.bd`;
      await Student.deleteOne({ studentId });
      await Member.deleteOne({ email });
    }

    // 3. Quick check: If we already have around 100 students, skip seeding the rest
    const studentCount = await Student.countDocuments();
    if (studentCount >= 100) {
      return;
    }

    // 4. Seed Specific Sample Students
    for (const studentData of sampleStudents) {
      const student = await Student.findOneAndUpdate(
        { studentId: studentData.studentId },
        { $setOnInsert: studentData },
        { upsert: true, new: true }
      );

      const existingMember = await Member.findOne({ email: studentData.email });
      if (!existingMember) {
        await Member.create({
          email: studentData.email,
          password: hashedPassword,
          userType: UserType.STUDENT,
          referenceId: student._id,
        });
      }
    }

    // 5. Generate and Seed 100 Students (ID suffix 0001 to 0100)
    for (let i = 1; i <= 100; i++) {
      const suffix = i.toString().padStart(4, "0");
      const studentId = `018221001210${suffix}`;
      const email = `student_${suffix}@lus.ac.bd`;

      const studentData = {
        studentId,
        email,
        name: `Student ${suffix}`,
        department: "CSE",
        batch: 59,
      };

      const student = await Student.findOneAndUpdate(
        { studentId },
        { $setOnInsert: studentData },
        { upsert: true, new: true }
      );

      await Member.findOneAndUpdate(
        { email },
        {
          $setOnInsert: {
            email,
            password: hashedPassword,
            userType: UserType.STUDENT,
            referenceId: student._id,
          },
        },
        { upsert: true }
      );
    }

    console.log("Students (0001-0100) and Members seeded successfully");
  } catch (error) {
    console.error("Error seeding students:", error);
  }
}
