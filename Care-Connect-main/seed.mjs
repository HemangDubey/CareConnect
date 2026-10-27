import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/careconnect";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB:", MONGODB_URI);

  const db = mongoose.connection.db;

  // 1. Super Admin
  const adminCol = db.collection("admins");
  const existingAdmin = await adminCol.findOne({ email: "aryan@careconnect.com" });
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("test123", salt);
    await adminCol.insertOne({
      name: "Aryan",
      email: "aryan@careconnect.com",
      password: hashedPassword,
    });
    console.log("Seeded Super Admin: aryan@careconnect.com / test123");
  } else {
    console.log("Super Admin already exists");
  }

  // 2. Sample Home
  const homeCol = db.collection("homes");
  let home = await homeCol.findOne({ name: "Morning Star Orphanage" });
  if (!home) {
    const homeResult = await homeCol.insertOne({
      name: "Morning Star Orphanage",
      type: "orphanage",
      location: "Bangalore, Karnataka",
      contact: "9876543210",
      description: "A safe haven providing shelter, education, and nutrition to orphaned children.",
      imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop",
      upi: {
        vpa: "morningstar@upi",
        qrImageUrl: "",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    home = { _id: homeResult.insertedId, name: "Morning Star Orphanage" };
    console.log("Seeded Home: Morning Star Orphanage");
  } else {
    console.log("Home already exists");
  }

  // 3. Home Admin
  const homeAdminCol = db.collection("homeadmins");
  const existingHomeAdmin = await homeAdminCol.findOne({ email: "star@gmail.com" });
  if (!existingHomeAdmin) {
    const hashedPassword = await bcrypt.hash("star123", 10);
    await homeAdminCol.insertOne({
      name: "MorningStar",
      email: "star@gmail.com",
      password: hashedPassword,
      home: home._id,
    });
    console.log("Seeded Home Admin: star@gmail.com / star123");
  } else {
    console.log("Home Admin already exists");
  }

  // 4. Sample Regular User
  const userCol = db.collection("users");
  const existingUser = await userCol.findOne({ email: "sinhaaryan173@gmail.com" });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("Aryan7293", 10);
    await userCol.insertOne({
      name: "Aryan Sinha",
      email: "sinhaaryan173@gmail.com",
      password: hashedPassword,
      provider: "credentials",
      createdAt: new Date(),
    });
    console.log("Seeded User: sinhaaryan173@gmail.com / Aryan7293");
  } else {
    console.log("User already exists");
  }

  console.log("Database seeding completed successfully!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
