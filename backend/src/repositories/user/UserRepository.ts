import { injectable } from "inversify";
import type { IUser } from "../../models/User.model";
import { UserModel } from "../../models/User.model";
import { IUserRepository } from "../../types/repositories/user/IUserRepository";

@injectable()
export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  }

  async create(data: {
    name?: string;
    email: string;
    password: string | null;
    role: "user" | "provider" | "admin";
    isVerified: boolean;
    provider?: "google" | "local";
  }): Promise<IUser> {
    const user = new UserModel(data);
    await user.save();
    return user;
  }

  async verifyUser(email: string): Promise<void> {
    await UserModel.updateOne(
      { email },
      { $set: { isVerified: true } }
    ).exec();
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      password,
    }).exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).exec();
  }
}