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

  /* ====================================================== */
  /* EMAIL */
  /* ====================================================== */

  async findByEmail(
    email: string,
  ): Promise<IUser | null> {
    return this.findOne({
      email,
    });
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<IUser | null> {
    return this.model
      .findOne({
        email,
      })
      .select("+password")
      .exec();
  }

  /* ====================================================== */
  /* PASSWORD */
  /* ====================================================== */

  async findByIdWithPassword(
    id: string,
  ): Promise<IUser | null> {
    return this.model
      .findById(id)
      .select("+password")
      .exec();
  }

  async updatePassword(
    userId: string,
    password: string,
  ): Promise<void> {
    await this.updateOne(
      { _id: userId },
      {
        password,
      },
    );
  }

  /* ====================================================== */
  /* VERIFY */
  /* ====================================================== */

  async verifyUser(
    email: string,
  ): Promise<void> {
    await this.updateOne(
      { email },
      {
        isVerified: true,
      },
    );
  }

  /* ====================================================== */
  /* PROFILE */
  /* ====================================================== */

  async updateById(
    id: string,
    data: Partial<IUser>,
  ): Promise<IUser | null> {
    return this.updateOne(
      { _id: id },
      data,
    );
  }

  async updateProfilePicture(
    userId: string,
    imageUrl: string,
  ): Promise<void> {
    await this.updateOne(
      { _id: userId },
      {
        profilePicture:
          imageUrl,
      },
    );
  }

  /* ====================================================== */
  /* PAGINATION */
  /* ====================================================== */

  async findAllPaginated(
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    users: IUser[];

    total: number;

    page: number;

    totalPages: number;
  }> {
    const query = search
      ? {
          $or: [
            {
              name: {
                $regex:
                  search,
                $options:
                  "i",
              },
            },

            {
              email: {
                $regex:
                  search,
                $options:
                  "i",
              },
            },
          ],
        }
      : {};

    const result =
      await this.paginate(
        query,
        {
          page,
          limit,
        },
      );

    return {
      users:
        result.data,

      total:
        result.total,

      page:
        result.page,

      totalPages:
        result.totalPages,
    };
  }
}