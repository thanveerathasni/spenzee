import { IUser } from "../../../models/User.model";
import { UserDTO } from "../../dto/user/user.dto";
import { UserProfileDTO } from "../../dto/user/userProfile.dto";


export class UserMapper {
  static toDTO(user: IUser): UserDTO {
    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
  static toProfileDTO(user: IUser): UserProfileDTO {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };
}


}
