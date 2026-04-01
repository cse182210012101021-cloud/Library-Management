import bcrypt from "bcryptjs";
import Student from "@/model/Student";
import Member from "@/model/Member";
import { sampleStudents } from "@/deafult-data/student-list";
import { UserType } from "@/constant/enum/UserType";

export async function seedStudents() {
  try {
    // 1. Quick check: If we already have many students, skip seeding
    const studentCount = await Student.countDocuments();
    if (studentCount >= 200) {
      return; 
    }

    console.log("Seeding students (this may take a moment)...");
    const hashedPassword = await bcrypt.hash("123456", 10); // Default password for all students

    // 2. Seed Specific Sample Students
    for (const studentData of sampleStudents) {
      const student = await Student.findOneAndUpdate(
        { studentId: studentData.studentId },
        { $setOnInsert: studentData },
        { upsert: true, new: true }
      );

      await Member.findOneAndUpdate(
        { email: studentData.email },
        {
          $setOnInsert: {
            email: studentData.email,
            password: hashedPassword,
            userType: UserType.STUDENT,
            referenceId: student._id,
          },
        },
        { upsert: true }
      );
    }

    // 3. Generate and Seed 200 Students (ID suffix 0001 to 0200)
    for (let i = 1; i <= 200; i++) {
      const suffix = i.toString().padStart(4, '0');
      const studentId = `018221001210${suffix}`;
      const email = `student_${suffix}@lus.ac.bd`;
      
      const studentData = {
        studentId,
        email,
        name: `Student ${suffix}`,
        department: "CSE",
        batch: 59,
      };

      // Create Student if not exists
      const student = await Student.findOneAndUpdate(
        { studentId },
        { $setOnInsert: studentData },
        { upsert: true, new: true }
      );

      // Create Member for Student if not exists
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

    console.log("Students (0001-0200) and Members seeded successfully");
  } catch (error) {
    console.error("Error seeding students:", error);
  }
}
