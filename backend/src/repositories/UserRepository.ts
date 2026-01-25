import { injectable } from "inversify";
import { IUserRepository } from "../types/repositories/IUserRepository";
import { UserModel, IUser } from "../models/User.model";

@injectable()
export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  }
}
