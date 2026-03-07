import { IUser } from "../models/User.model";

export class UserMapper {
  static toResponse(user: IUser) {
    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
  }
}