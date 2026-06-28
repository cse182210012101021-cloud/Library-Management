import Admin from "@/database/model/Admin";
import Member from "@/database/model/Member";
import { UserType } from "@/shared/constant/enum/UserType";
import { Department } from "@/shared/constant/enum/Department";

export async function seedAdmins() {
  try {
    const adminMembers = await Member.find({ userType: UserType.ADMIN });

    for (const member of adminMembers) {
      if (!member.referenceId) {
        let department = Department.CSE;
        let designation = "head";
        
        const match = member.email.match(/^(head|dean)_([a-z]+)@lus\.ac\.bd$/);
        if (match) {
          designation = match[1];
          const extractedDept = match[2].toUpperCase();
          if (Object.values(Department).includes(extractedDept as Department)) {
            department = extractedDept as Department;
          }
        }

        const admin = await Admin.findOneAndUpdate(
          { email: member.email },
          {
            $setOnInsert: {
              email: member.email,
              name: `Admin ${department}`,
              department: department,
              designation: designation,
              image: member.image || null,
            }
          },
          { upsert: true, new: true }
        );

        member.referenceId = admin._id;
        // Mongoose might not let you assign referenceModel immediately if it's missing in some contexts, but let's do it using $set
        await Member.updateOne(
          { _id: member._id },
          { $set: { referenceId: admin._id, referenceModel: "admins" } }
        );
      }
    }
    
    // Seed default admin if none exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultEmail = "head_cse@lus.ac.bd";
      
      const admin = await Admin.findOneAndUpdate(
        { email: defaultEmail },
        {
           $setOnInsert: {
             email: defaultEmail,
             name: "Admin CSE",
             department: Department.CSE,
             designation: "head"
           }
        },
        { upsert: true, new: true }
      );
      
      const bcrypt = (await import("bcryptjs")).default;
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      
      const existingMember = await Member.findOne({ email: defaultEmail });
      if (!existingMember) {
        await Member.create({
          email: defaultEmail,
          userType: UserType.ADMIN,
          password: hashedPassword,
          referenceId: admin._id,
          referenceModel: "admins"
        });
      }
    }

    console.log("Admins seeded successfully");
  } catch (error) {
    console.error("Error seeding admins:", error);
  }
}
