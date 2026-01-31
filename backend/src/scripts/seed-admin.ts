import "reflect-metadata";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import { AdminModel } from "../models/Admin.model";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables");
  process.exit(1);
}

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    const email = "admin@spenze.com";
    const plainPassword = "Admin@123"; // 🔴 change after first login

    const existingAdmin = await AdminModel.findOne({ email });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    await AdminModel.create({
      email,
      password: hashedPassword,
      isActive: true
    });

    console.log("🚀 Admin created successfully");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${plainPassword}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed admin", error);
    process.exit(1);
  }
}

seedAdmin();
