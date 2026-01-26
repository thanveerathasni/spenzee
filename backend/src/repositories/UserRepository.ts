import { injectable } from "inversify";
import { IUserRepository } from "../types/repositories/IUserRepository";
import { UserModel, IUser } from "../models/User.model";

@injectable()
export class UserRepository implements IUserRepository {

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  }

  async create(data: {
    email: string;
    password: string;
    role: "user" | "provider" | "admin";
    isVerified: boolean;
  }): Promise<void> {
    await UserModel.create(data);
  }

  async verifyUser(email: string): Promise<void> {
    await UserModel.updateOne(
      { email },
      { isVerified: true }
    );
  }

  async updatePassword(
  userId: string,
  hashedPassword: string
): Promise<void> {
  await UserModel.updateOne(
    { _id: userId },
    { password: hashedPassword }
  );
}

}
