import { IUser } from "../../../models/User.model";
import { UserDTO } from "../../dto/user/user.dto";

export class UserMapper {
  static toDTO(user: IUser): UserDTO {
    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
}
