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
async findAllPaginated(page: number, limit: number, search: string) {
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const users = await UserModel.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await UserModel.countDocuments(query);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
  async updatePassword(userId: string, password: string): Promise<void> {
    await this.model.findByIdAndUpdate(userId, { password }).exec();
  }


   async updateById(
    id: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    return this.model.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
  }

}



