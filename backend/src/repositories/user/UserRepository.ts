import { injectable } from "inversify";
import { IUser, UserModel } from "../../models/User.model";
import { BaseRepository } from "../../shared/base/BaseRepository";

import { IUserRepository } from "../../types/repositories/user/IUserRepository";

@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).exec();
  }

  async verifyUser(email: string): Promise<void> {
    await this.model.updateOne({ email }, { isVerified: true }).exec();
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    await this.model.findByIdAndUpdate(userId, { password }).exec();
  }

 
}
